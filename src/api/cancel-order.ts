import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type CancelOrderResponse = {
  clientOrderId: string
  cumQty: string
  cumQuote: string
  executedQty: string
  orderId: number
  origQty: string
  origType: string
  price: string
  reduceOnly: false
  side: 'BUY' | 'SELL'
  positionSide: 'SHORT' | 'LONG' | 'BOTH'
  status: string
  stopPrice: string
  closePosition: boolean // if Close-All
  symbol: string
  timeInForce: string
  type: string
  activatePrice: string
  priceRate: string
  updateTime: number
  workingType: string
  priceProtect: boolean
  priceMatch: string
  selfTradePreventionMode: string
  goodTillDate: number
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  symbol: string
  orderId: number
  queryClient: QueryClient
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function cancelOrder({
  apiKey,
  secretKey,
  isTestnetAccount,
  symbol,
  orderId,
  queryClient,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  const params = {
    symbol,
    orderId,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/order${query}`

  try {
    await api<CancelOrderResponse>({
      method: 'delete',
      apiKey,
      isTestnetAccount,
      url,
    })
    await queryClient.invalidateQueries({ queryKey: ['open-orders'] })

    if (dispatchSuccessMessage) {
      toast.success(`Order canceled successfully!`)
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't cancel the order.", {
        description: error as string,
      })
    }
  }
}
