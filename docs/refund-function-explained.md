# Refund Function — Detailed Explanation

## System Overview

The refund feature spans three layers:

1. **UI** — `LiveOrderCard` renders the Refund button and triggers the flow
2. **Context** — `OrdersContext` manages the API call and updates the local order state
3. **API Route** — `app/api/refund/route.ts` handles auth, calls Square, and updates Supabase

The customer's payment was originally processed in the **PickMeUp** customer app via Square. When the payment succeeded, the Square payment ID (`square_payment_id`) was saved to the `orders` table in Supabase. The Manager app uses this ID to issue the refund back to the customer's card.

---

## Full Flow: Button Click to Refund Issued

```
Staff clicks "Refund"
        │
        ▼
LiveOrderCard → handleRefund()
        │  sets refunding = true
        │
        ▼
OrdersContext → refundOrder(orderId)
        │  optimistically removes card from liveOrders
        │
        ▼
POST /api/refund  { orderId }
        │
        ├─ 1. Verify session (Supabase auth)
        ├─ 2. Check role (profiles table)
        ├─ 3. Fetch order from Supabase
        ├─ 4. Call Square Refunds API
        └─ 5. Update order status → 'refunded'
```

---

## Step-by-Step Code Walkthrough

### Step 1 — UI: `components/orders/LiveOrderCard.tsx`

The `ActionButton` component renders a **Refund** button for orders with status `in_progress` or `ready`. When clicked:

```typescript
const handleRefund = async () => {
  if (refunding) return; // guard against double-clicks
  setRefunding(true);
  await refundOrder(order.id); // calls context function
  setRefunding(false);
};
```

The `refunding` state disables the button and changes its label to "Refunding..." while the API call is in progress.

---

### Step 2 — Context: `context/OrdersContext.tsx`

```typescript
const refundOrder = useCallback(async (id: string) => {
  setLiveOrders((prev) => prev.filter((o) => o.id !== id)); // optimistic removal

  try {
    const res = await fetch("/api/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("Refund failed:", body.error ?? res.statusText);
    }
  } catch (err) {
    console.error("Refund request threw:", err);
  }
}, []);
```

**Optimistic update:** The order card is removed from the UI immediately before the API call completes. This makes the interface feel instant. If the API call fails, the card stays removed (same behaviour as `rejectOrder`).

**Real-time sync:** `OrdersContext` also listens to Supabase real-time `UPDATE` events. When the API route successfully sets the order status to `'refunded'` in the database, Supabase fires an update event. The context handles it by removing the order from `liveOrders` on any other connected devices or tabs:

```typescript
if (
  (["completed", "rejected", "refunded"] as OrderStatus[]).includes(
    order.status,
  )
) {
  setLiveOrders((prev) => prev.filter((o) => o.id !== order.id));
}
```

---

### Step 3 — API Route: `app/api/refund/route.ts`

#### Auth Check

```typescript
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Uses the Supabase SSR client which reads the session from the request's cookies. If no valid session exists, returns 401.

#### Role Check

```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (!ALLOWED_ROLES.includes(profile?.role)) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

Fetches the user's role from the `profiles` table. Only `super_admin`, `admin`, and `staff` are allowed. If the profile is not found or the role doesn't match, returns 403.

#### Order Fetch

```typescript
const { data: order, error: fetchError } = await supabase
  .from("orders")
  .select("id, square_payment_id, total_cents")
  .eq("id", orderId)
  .single();

if (fetchError || !order) {
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}

if (!order.square_payment_id) {
  return NextResponse.json(
    { error: "Order has no payment on file to refund" },
    { status: 422 },
  );
}
```

Fetches only the three fields needed: `id`, `square_payment_id`, and `total_cents`. The `square_payment_id` is what links this order to a real charge in Square. If it's null (e.g. a test order created without going through the payment flow), a 422 is returned and no refund is attempted.

#### Square Refund API Call

```typescript
const { refunds } = getSquareClient();
let refundId: string | undefined;

try {
  const response = await refunds.refundPayment({
    idempotencyKey: randomUUID(),
    paymentId: order.square_payment_id,
    amountMoney: {
      amount: BigInt(order.total_cents),
      currency: "CAD",
    },
    reason: "Staff-initiated refund via PickMeUp Manager",
  });
  refundId = response.refund?.id;
} catch (err: any) {
  const detail =
    err?.errors?.[0]?.detail ?? err?.message ?? "Square refund failed";
  return NextResponse.json({ error: detail }, { status: 502 });
}
```

Key details:

- **`idempotencyKey`**: A fresh UUID generated per request via `randomUUID()`. This is Square's duplicate-charge prevention mechanism — if the same key is sent twice, Square only processes the refund once. A new UUID per click is appropriate here since each button click is a distinct staff intent.
- **`paymentId`**: The `square_payment_id` stored in Supabase, linking this refund to the original charge.
- **`amountMoney.amount`**: Must be a `BigInt` (Square SDK v44 requirement). The amount is `total_cents` — the full order amount — making this a full refund.
- **`currency: 'CAD'`**: Must match the currency used when the original payment was created.
- **Error handling**: Square SDK v44 **throws exceptions** on API errors rather than returning them in the response. The `catch` block extracts the human-readable detail from `err.errors[0].detail` (Square's structured error format) and returns a 502.

#### Supabase Status Update

```typescript
const { error: updateError } = await supabase
  .from("orders")
  .update({ status: "refunded" })
  .eq("id", orderId);

if (updateError) {
  // Return partial success — money is already refunded, don't let caller retry
  return NextResponse.json(
    { success: true, refundId, warning: "Status update failed" },
    { status: 207 },
  );
}

return NextResponse.json({ success: true, refundId });
```

After Square confirms the refund, the order's status is updated to `'refunded'` in Supabase. This change propagates to all connected clients via the real-time subscription.

**Important:** If the Supabase update fails after the Square refund has already succeeded, the route returns a 207 (Multi-Status) with `success: true`. This prevents the client from treating it as a failure and retrying — which would attempt to refund the customer a second time. The warning is logged server-side for manual resolution.

---

## Square Client: `lib/square.ts`

```typescript
export function getSquareClient() {
  const { SquareClient, SquareEnvironment } = require("square");

  if (!process.env.SQUARE_ACCESS_TOKEN) {
    throw new Error("Missing SQUARE_ACCESS_TOKEN environment variable");
  }

  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
  });

  return { refunds: client.refunds, client };
}
```

- **Lazy `require()`**: The import is inside the function body so the Square SDK is never bundled into client-side JavaScript. This function is only ever called from server-side API routes.
- **`SquareEnvironment.Sandbox`**: Points to Square's test environment. Change to `SquareEnvironment.Production` when going live.
- **`SQUARE_ACCESS_TOKEN`**: Must be the same access token used in the PickMeUp customer app, since the original payments were taken under that account.

---

## Data Flow Diagram

```
Customer App (PickMeUp)          Supabase DB            Manager App
─────────────────────────        ──────────────         ───────────────────────
Customer pays via Square    →    orders table:          Staff sees live order
  Square returns payment_id      square_payment_id  ←   on Live Orders page
  Saved to orders table          total_cents
                                 status: 'in_progress'

                                                        Staff clicks Refund
                                                               │
                                                        POST /api/refund
                                                               │
                                                        Square Refunds API
                                                        ← refund issued to card
                                                               │
                                                        orders table:
                                                        status → 'refunded'
                                                               │
                                                        Real-time broadcast
                                                        → card removed from UI
```

---

## Error Reference

| HTTP Status              | Meaning                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| 401 Unauthorized         | No valid session cookie — user is not logged in                                |
| 403 Forbidden            | User is logged in but their role is not in `['super_admin', 'admin', 'staff']` |
| 400 Bad Request          | `orderId` was not provided in the request body                                 |
| 404 Not Found            | No order with the given ID exists in Supabase                                  |
| 422 Unprocessable Entity | Order exists but `square_payment_id` is null — nothing to refund               |
| 502 Bad Gateway          | Square API returned an error (e.g. already refunded, payment not found)        |
| 207 Multi-Status         | Square refund succeeded but Supabase status update failed — money was returned |
| 200 OK                   | Refund fully processed and order status updated                                |
