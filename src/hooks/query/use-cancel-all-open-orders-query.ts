import { cancelAllOpenOrders } from '@/api/cancel-all-open-orders'
import { useMutation } from '@tanstack/react-query'

export const useCancelAllOpenOrdersQuery = () => {
  return useMutation({
    mutationFn: cancelAllOpenOrders,
  })
}
