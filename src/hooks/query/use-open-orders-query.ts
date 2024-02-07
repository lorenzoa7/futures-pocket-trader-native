import { getOpenOrders } from '@/api/get-open-orders'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useOpenOrdersQuery = () => {
  const { isTestnetAccount, apiKey, secretKey } = useAccountStore()
  return useQuery({
    queryKey: ['open-orders'],
    queryFn: () => getOpenOrders({ isTestnetAccount, apiKey, secretKey }),
  })
}
