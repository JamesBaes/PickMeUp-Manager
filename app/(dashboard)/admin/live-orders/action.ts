'use server'

import { OrderStatus } from "@/types";
import { createClient } from "@/utils/server";

export const acceptOrder = async (orderId: number | string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'in_progress' })
    .eq('id', orderId)

  return { data, error }
}
export const adjustOrderStatus = async (orderId: string, status: OrderStatus) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  return { data, error }
}

export const adjustOrderWaitTime = async (orderId: string, suggestedTime: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ suggested_time: suggestedTime })
    .eq('id', orderId)

  return { data, error }
}