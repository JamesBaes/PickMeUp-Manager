# How the Refund Feature Works — A Beginner's Guide

This document walks through exactly what happens when a staff member issues a refund in the PickMeUp Manager app, from the moment they press the button to the money going back to the customer.

---

## The Big Picture

When a refund is issued, **three things need to happen**:

1. **Square** (the payment processor) needs to actually send the money back to the customer's card.
2. **Supabase** (our database) needs to be updated so we have a record that the order was refunded, who did it, and why.
3. **The screen** needs to update so the order disappears from the live orders list.

These three things happen in sequence, and different parts of the code are each responsible for one piece.

---

## Step-by-Step Walkthrough

### Step 1 — The Staff Member Sees the Refund Button

**File:** `components/orders/LiveOrderCard.tsx`

Each order on the screen is displayed as a card. Inside that card there is a component called `ActionButton`. This component looks at the order's current status and decides what buttons to show.

If an order is either `in_progress` or `ready`, it shows two buttons: a main action button (like "Ready" or "Complete") and a red **Refund** button underneath.

```
[ Ready ]
[ Refund ]
```

---

### Step 2 — Staff Clicks "Refund" → A Confirmation Form Appears

**File:** `components/orders/LiveOrderCard.tsx`

When the staff member clicks **Refund**, the button does **not** immediately process anything. Instead, it sets a piece of state called `confirming` to `true`.

> **What is "state"?** State is just a variable that React watches. When it changes, React re-draws the relevant part of the screen automatically.

Because `confirming` is now `true`, the component re-draws itself and shows a confirmation form instead of the buttons. That form contains:

- A message showing the amount that will be refunded (e.g. *"Issue full refund of $12.50?"*)
- A text input: **"Your name"** — the staff member types their name here
- A text input: **"Reason for refund"** — the staff member types why they're refunding
- A **Cancel** button and a red **Confirm Refund** button

As the staff member types, two more state variables (`staffName` and `refundReason`) update in real time to store what they've typed.

---

### Step 3 — Staff Clicks "Confirm Refund"

**File:** `components/orders/LiveOrderCard.tsx` → `handleConfirm` function

When **Confirm Refund** is clicked, the `handleConfirm` function runs. Here's what it does, in order:

1. Sets `confirming` back to `false` — hides the form
2. Sets `refunding` to `true` — this disables the Refund button and shows "Refunding..." so the staff member knows something is happening
3. Calls `refundOrder(order.id, refundReason, staffName)` — this is the function that actually does the work (covered in the next step)
4. Once that finishes, sets `refunding` back to `false` and clears the name/reason inputs

---

### Step 4 — The Context Sends a Request to the Server

**File:** `context/OrdersContext.tsx` → `refundOrder` function

`refundOrder` lives inside something called the **Orders Context**. Think of the context as a shared "brain" that all the order-related components in the app can talk to. It holds the list of live orders and all the functions that can change them.

The `refundOrder` function does the following:

1. Makes a **POST request** to `/api/refund` — this is like sending a message to the server saying "please process this refund"
2. Includes three pieces of information in that message:
   - `orderId` — which order to refund
   - `reason` — the reason the staff member typed
   - `staffName` — the staff member's name
3. Waits for the server to respond:
   - **If it worked:** removes the order from the live orders list on screen, and shows a green success toast notification
   - **If it failed:** shows a red error toast notification with a description of what went wrong
   - **If the network itself broke:** shows a "network error" toast

> **What is a POST request?** It's a way for the browser to send data to the server. Think of it like filling out a form and hitting submit — the browser packages up the data and sends it over to the server to process.

---

### Step 5 — The Server Handles the Request

**File:** `app/api/refund/route.ts`

This is the server-side code that runs when the browser sends the POST request. It's a **Next.js API route** — basically a mini server function that only runs when called.

Here's everything it does, in order:

#### 5a. Check that the user is logged in

```
Is there a logged-in user? → No → Return "Unauthorized" error
```

It uses Supabase Auth to check if the person making the request is actually logged in. If not, it stops immediately and returns an error.

#### 5b. Check that the user has the right role

```
Is the user's role "super_admin", "admin", or "staff"? → No → Return "Forbidden" error
```

Not everyone should be able to issue refunds. The server checks the user's role in the `profiles` table in Supabase. Only users with an allowed role can proceed.

#### 5c. Parse the request body

It reads the `orderId`, `reason`, and `staffName` that were sent from the browser. If no `orderId` was provided, it returns an error immediately.

#### 5d. Look up the order in Supabase

It fetches the order from the database to get two critical pieces of information:
- `square_payment_id` — the ID that Square uses to identify the original payment (needed to reverse it)
- `total_cents` — the amount to refund, in cents (e.g. $12.50 → 1250)

If the order doesn't exist or has no payment on file, it returns an error.

#### 5e. Call the Square Refunds API

This is where the actual money movement happens.

```
Square: "Here is the payment ID and the amount — please reverse this charge."
```

The server calls Square's `refundPayment` function with:
- A unique ID (`idempotencyKey`) to make sure the same refund is never processed twice accidentally
- The `square_payment_id` of the original charge
- The amount in cents, with the currency set to `CAD`
- A reason string: `'Staff-initiated refund via PickMeUp Manager'`

> **Note:** This reason string is what Square sees. The reason the staff member typed is stored separately in our own database (see next step).

If Square returns an error (e.g. the payment was already refunded), the server stops and returns that error to the browser.

#### 5f. Update the order in Supabase

Once Square confirms the refund went through, the server updates the order row in the database:

| Column | Value |
|---|---|
| `status` | `'refunded'` |
| `refunder_name` | The staff member's name |
| `refund_reason` | The reason for the refund |

If this database update fails (rare, but possible), the server still returns a success response — because the money **has** already been sent back to the customer. It just includes a `warning` field to flag that the database update didn't complete.

#### 5g. Return success

If everything worked, the server sends back `{ success: true, refundId }` and the browser's `refundOrder` function handles the rest (removing the order from the screen, showing the toast).

---

## The Full Flow, Visualised

```
Staff presses "Refund"
  ↓
Confirmation form appears (name + reason inputs)
  ↓
Staff fills in name & reason, presses "Confirm Refund"
  ↓
handleConfirm() runs in LiveOrderCard.tsx
  ↓
refundOrder(id, reason, staffName) called from OrdersContext.tsx
  ↓
POST request sent to /api/refund
  ↓
  [SERVER SIDE — app/api/refund/route.ts]
  ├── Check: is user logged in?
  ├── Check: does user have allowed role?
  ├── Fetch order from Supabase (get square_payment_id + total_cents)
  ├── Call Square API → money goes back to customer's card
  └── Update Supabase order row:
        status        = 'refunded'
        refunder_name = staffName
        refund_reason = reason
  ↓
Response sent back to browser
  ↓
Order removed from live orders list on screen
  ↓
Green "Refund issued successfully" toast shown
```

---

## Where the Data Lives

### In the Code

| File | Responsibility |
|---|---|
| `types/index.ts` | Defines the shape of an `Order` object, including the new `refunder_name` and `refund_reason` fields |
| `components/orders/LiveOrderCard.tsx` | Renders the order card and handles all the UI (buttons, form, state) |
| `context/OrdersContext.tsx` | Holds the `refundOrder` function, manages the live orders list, handles success/error toasts |
| `app/api/refund/route.ts` | Server-side: checks auth, calls Square, updates Supabase |

### In the Database (Supabase `orders` table)

| Column | Type | Description |
|---|---|---|
| `status` | text | Set to `'refunded'` after a successful refund |
| `refunder_name` | text \| null | Name of the staff member who issued the refund |
| `refund_reason` | text \| null | The reason they entered for the refund |

---

## What Happens If Something Goes Wrong?

| Scenario | What happens |
|---|---|
| Staff is not logged in | Server returns 401 Unauthorized — refund is blocked |
| Staff doesn't have the right role | Server returns 403 Forbidden — refund is blocked |
| Order not found in database | Server returns 404 — refund is blocked |
| Order has no Square payment ID | Server returns 422 — refund is blocked |
| Square rejects the refund | Server returns the Square error message — refund is blocked, no money moved |
| Square succeeds but Supabase update fails | Server returns 207 Partial Success — money is refunded but the DB record may be incomplete |
| Network error on the browser side | `refundOrder` catches the error and shows "Refund failed — network error" toast |
