import { newOrder } from '@/api/new-order'
import { ErrorCodes } from '@/config/connections'
import { useMutation } from '@tanstack/react-query'

export const useNewOrderQuery = () => {
  return useMutation({
    mutationFn: newOrder,
    meta: { errorCode: ErrorCodes.NEW_ORDER_FAILED },
  })
}
