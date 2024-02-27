import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type CancelAllOpenOrdersResponse = {
  code: number
  msg: string
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  symbols: string[]
  queryClient: QueryClient
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function cancelAllOpenOrders({
  apiKey,
  secretKey,
  isTestnetAccount,
  symbols,
  queryClient,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  try {
    const promises = symbols.map((symbol) => {
      const params = {
        symbol,
        recvWindow: defaultParams.recvWindow,
        timestamp: defaultParams.timestamp,
      }

      const query = generateQueryString({ params, secretKey })
      const url = `/fapi/v1/allOpenOrders${query}`

      return api<CancelAllOpenOrdersResponse>({
        method: 'delete',
        apiKey,
        isTestnetAccount,
        url,
      })
    })

    await Promise.all(promises)
    await queryClient.invalidateQueries({ queryKey: ['open-orders'] })

    if (dispatchSuccessMessage) {
      toast.success(`All orders canceled successfully!`)
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't cancel all orders.", {
        description: error as string,
      })
    }
  }
}
