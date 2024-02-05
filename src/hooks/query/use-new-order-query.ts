import { newOrder } from '@/api/new-order'
import { useMutation } from '@tanstack/react-query'

export const useNewOrderQuery = () => {
  return useMutation({
    mutationFn: newOrder,
  })
}
