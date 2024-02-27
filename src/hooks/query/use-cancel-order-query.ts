import { cancelOrder } from '@/api/cancel-order'
import { useMutation } from '@tanstack/react-query'

export const useCancelOrderQuery = () => {
  return useMutation({
    mutationFn: cancelOrder,
  })
}
