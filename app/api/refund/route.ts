import { createClient } from '@/utils/server'
import { NextRequest, NextResponse } from 'next/server'
import { getSquareClient } from '@/lib/square'
import { randomUUID } from 'crypto'

const ALLOWED_ROLES = ['super_admin', 'admin', 'staff']

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!ALLOWED_ROLES.includes(profile?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse body
  const { orderId } = await req.json()
  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
  }

  // Fetch order from Supabase
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, square_payment_id, total_cents')
    .eq('id', orderId)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (!order.square_payment_id) {
    return NextResponse.json({ error: 'Order has no payment on file to refund' }, { status: 422 })
  }

  // Call Square Refunds API
  const { refunds } = getSquareClient()
  let refundId: string | undefined

  try {
    const response = await refunds.refundPayment({
      idempotencyKey: randomUUID(),
      paymentId: order.square_payment_id,
      amountMoney: {
        amount: BigInt(order.total_cents),
        currency: 'CAD',
      },
      reason: 'Staff-initiated refund via PickMeUp Manager',
    })
    refundId = response.refund?.id
  } catch (err: any) {
    console.error('Square refund error:', err)
    const detail = err?.errors?.[0]?.detail ?? err?.message ?? 'Square refund failed'
    return NextResponse.json({ error: detail }, { status: 502 })
  }

  // Update order status in Supabase
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'refunded' })
    .eq('id', orderId)

  if (updateError) {
    console.error('Failed to update order status after refund:', updateError)
    // The money has been refunded but the DB update failed.
    // Return partial success so the caller knows the refund went through and does not retry.
    return NextResponse.json(
      { success: true, refundId, warning: 'Status update failed' },
      { status: 207 }
    )
  }

  return NextResponse.json({ success: true, refundId })
}
