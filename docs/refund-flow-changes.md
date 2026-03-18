# Refund Flow — Changes & How It Works

## Overview

The refund flow was updated to collect a **staff name** and **reason for refund** from the manager before issuing a refund. These values are stored in the Supabase `orders` table under two new columns: `refunder_name` and `refund_reason`.

---

## Files Changed

### 1. `types/index.ts`

**What changed:** Two optional fields were added to the `Order` interface to match the new Supabase columns.

```ts
refunder_name: string | null;
refund_reason: string | null;
```

These are nullable because existing orders (before this change) will not have these values set.

---

### 2. `components/orders/LiveOrderCard.tsx`

**What changed:** The refund confirmation UI now includes two text input fields.

#### New state variables (inside `ActionButton`)

```ts
const [refundReason, setRefundReason] = useState("");
const [staffName, setStaffName] = useState("");
```

These track what the staff member types in real time.

#### Updated confirmation UI

When a staff member clicks **Refund**, the card switches into a confirmation view. Previously this just showed a confirm/cancel prompt. Now it also renders:

- A **"Your name"** input — captures who is issuing the refund (`staffName`)
- A **"Reason for refund"** input — captures why the refund is being issued (`refundReason`)

Both inputs are cleared when the staff member cancels or after a refund completes successfully.

#### Updated `handleConfirm`

```ts
const handleConfirm = async () => {
  setConfirming(false);
  setRefunding(true);
  await refundOrder(order.id, refundReason, staffName);
  setRefunding(false);
  setRefundReason("");
  setStaffName("");
};
```

The two values are passed directly into `refundOrder` alongside the order ID.

#### Updated `ActionButton` prop type

```ts
refundOrder: (id: string, reason: string, staffName: string) => Promise<void>;
```

---

### 3. `context/OrdersContext.tsx`

**What changed:** `refundOrder` now accepts and forwards `reason` and `staffName` to the API.

#### Updated function signature

```ts
const refundOrder = useCallback(async (id: string, reason: string, staffName: string) => {
```

The context type definition was updated to match:

```ts
refundOrder: (id: string, reason: string, staffName: string) => Promise<void>;
```

#### Updated fetch body

```ts
body: JSON.stringify({ orderId: id, reason, staffName });
```

The two new fields are included in the POST request body sent to `/api/refund`.

---

### 4. `app/api/refund/route.ts`

**What changed:** The API route now reads `reason` and `staffName` from the request body and writes them to Supabase.

#### Parsing the request body

```ts
const { orderId, reason, staffName } = await req.json();
```

#### Writing to Supabase

```ts
.update({
  status: 'refunded',
  refunder_name: staffName ?? null,
  refund_reason: reason ?? null,
})
```

`?? null` ensures that if either value is missing or empty, `null` is stored rather than an empty string, keeping the database clean.

---

## Data Flow (end to end)

```
Staff presses "Refund"
  → Confirmation UI appears with two inputs
      → Staff types their name and a reason
          → Staff presses "Confirm Refund"
              → handleConfirm() calls refundOrder(id, reason, staffName)
                  → OrdersContext POSTs to /api/refund with { orderId, reason, staffName }
                      → API calls Square to issue the refund
                          → API updates Supabase orders row:
                              status        = 'refunded'
                              refunder_name = staffName
                              refund_reason = reason
```

---

## Notes

- The `reason` and `staffName` fields are **optional at the API level** — if the staff member leaves them blank, `null` is stored in the database. No validation is enforced in the UI.
- The Square refund itself still uses the hardcoded reason string `'Staff-initiated refund via PickMeUp Manager'` — `refund_reason` is stored in Supabase only, not sent to Square.
- The PickMeUp customer app (`/Fall-2025/CPSY-301/Phase3/PickMeUp`) was **not changed** — its `Order` type is a separate frontend-only structure unrelated to the Supabase schema.
