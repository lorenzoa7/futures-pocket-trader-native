import { getPositions } from '@/api/get-positions'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const usePositionsQuery = () => {
  const { isTestnetAccount, apiKey, secretKey } = useAccountStore()
  return useQuery({
    queryKey: ['positions'],
    queryFn: () => getPositions({ isTestnetAccount, apiKey, secretKey }),
  })
}
