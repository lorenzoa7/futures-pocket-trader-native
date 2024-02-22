import { getSymbolPrice } from '@/api/get-symbol-price'
import { mergeObjects } from '@/functions/merge-objects'
import { useQueries } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

export const useSymbolsPriceQueries = (symbols: string[]) => {
  const { isTestnetAccount } = useAccountStore()
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ['symbols-price', symbol],
      queryFn: () => getSymbolPrice({ symbol, isTestnetAccount }),
      enabled: symbols.length > 0,
      select: (data: number | undefined) => {
        return { [symbol]: data }
      },
    })),
    combine: (results) => {
      return {
        data: mergeObjects(...results.map((result) => result.data ?? {})),
        isPending: results.some((result) => result.isPending),
      }
    },
  })
}
