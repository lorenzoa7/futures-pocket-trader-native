import { getSymbols } from '@/api/get-symbols'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useSymbolsQuery = () => {
  const { isTestnetAccount } = useAccountStore()
  return useQuery({
    queryKey: ['symbols'],
    queryFn: () => getSymbols({ isTestnetAccount }),
  })
}
