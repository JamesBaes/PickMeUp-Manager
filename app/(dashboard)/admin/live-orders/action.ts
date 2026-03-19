'use server'

import { OrderStatus } from "@/types";
import { createClient } from "@/utils/server";

export const acceptOrder = async (orderId: string, pickupTime?: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status: 'in_progress',
      ...(pickupTime ? { pickup_time: pickupTime } : {})
    })
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

export const adjustOrderWaitTime = async (orderId: string, pickupTime: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ pickup_time: pickupTime })
    .eq('id', orderId)

  return { data, error }
}


