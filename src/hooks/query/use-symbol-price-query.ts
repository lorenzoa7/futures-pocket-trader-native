import { getSymbolPrice } from '@/api/get-symbol-price'
import { ErrorCodes } from '@/config/connections'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useSymbolPriceQuery = (symbol: string) => {
  const { isTestnetAccount } = useAccountStore()
  return useQuery({
    queryKey: ['symbol-price', symbol],
    queryFn: () => getSymbolPrice({ symbol, isTestnetAccount }),
    meta: { errorCode: ErrorCodes.SYMBOL_PRICE_FETCH_FAILED },
  })
}
