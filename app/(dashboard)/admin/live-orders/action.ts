import { createClient } from "@/utils/server";



export const acceptOrder = async (orderId: number | string, suggestedTime: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'accepted', suggested_time: suggestedTime })
    .eq('id', orderId);

  return { data, error };
};

export const adjustOrderWaitTime = () => {
  
}

export const adjustOrderStatus = () => {

}

