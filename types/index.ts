export type OrderStatus = 'paid' | 'in_progress' | 'ready' | 'completed' | 'refunded'
 
export interface OrderItem {
  name: string
  qty?: number
  quantity?: number
  price_cents?: number
}
 
export interface Order {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_id: string | null
  items: OrderItem[]
  total_cents: number
  square_payment_id: string | null
  status: OrderStatus
  pickup_time: string | null
  billing_address: string | null
  billing_country: string | null
  receipt_token: string
  restaurant_id: number | null
  refunder_name: string | null
  refund_reason: string | null
}