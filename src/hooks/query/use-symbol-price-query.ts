import { getSymbolPrice } from '@/api/get-symbol-price'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useSymbolPriceQuery = (symbol: string) => {
  const { isTestnetAccount } = useAccountStore()
  return useQuery({
    queryKey: ['symbol-price', symbol],
    queryFn: () => getSymbolPrice({ symbol, isTestnetAccount }),
  })
}
