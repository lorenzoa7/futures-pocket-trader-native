import { splitOrders } from '@/api/split-orders'
import { useMutation } from '@tanstack/react-query'

export const useSplitOrdersQuery = () => {
  return useMutation({
    mutationFn: splitOrders,
  })
}
