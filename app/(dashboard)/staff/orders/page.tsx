'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import OrderList from '@/components/orders/OrderList'

interface OrderValue {
	[key: string]: unknown
}

interface OrderItem {
	id: string
	created_at: string
	customer_name: string | null
	customer_phone: string | null
	items: OrderValue | unknown[] | null
	total_cents: number | null
	customer_email: string | null
	customer_id: string | null
}

const OrdersPage = () => {
	const [orders, setOrders] = useState<OrderItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
				const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

				if (!supabaseUrl || !supabaseKey) {
					throw new Error('Missing Supabase environment variables')
				}

				const supabase = createClient(supabaseUrl, supabaseKey)
				const { data, error } = await supabase
					.from('orders')
					.select('id, created_at, customer_name, customer_phone, items, total_cents, customer_email, customer_id')

				if (error) throw error
				setOrders((data as OrderItem[]) || [])
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : 'An error occurred'
				setError(errorMessage)
			} finally {
				setLoading(false)
			}
		}

		fetchOrders()
	}, [])

	if (loading) return <div className="p-4">Loading...</div>
	if (error) return <div className="p-4 text-red-500">Error: {error}</div>

	return (
		<div className="p-6 relative">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Orders</h1>
			</div>

			<OrderList orders={orders} />
		</div>
	)
}

export default OrdersPage
