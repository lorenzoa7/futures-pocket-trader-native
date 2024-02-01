import { getSymbols } from '@/api/get-symbols'
import { ErrorCodes } from '@/config/connections'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useSymbolsQuery = () => {
  const { isTestnetAccount } = useAccountStore()
  return useQuery({
    queryKey: ['symbols'],
    queryFn: () => getSymbols({ isTestnetAccount }),
    meta: { errorCode: ErrorCodes.SYMBOLS_FETCH_FAILED },
  })
}
