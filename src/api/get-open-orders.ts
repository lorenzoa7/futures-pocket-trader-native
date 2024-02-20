import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { toast } from 'sonner'

export type Order = {
  orderId: number
  symbol: string
  status: string
  clientOrderId: string
  price: string
  avgPrice: string
  origQty: string
  executedQty: string
  cumQuote: string
  timeInForce: string
  type: string
  reduceOnly: boolean
  closePosition: boolean
  side: 'BUY' | 'SELL'
  positionSide: 'BOTH' | 'LONG' | 'SHORT'
  stopPrice: string
  workingType: string
  priceProtect: boolean
  origType: string
  priceMatch: string
  selfTradePreventionMode: string
  goodTillDate: number
  time: number
  updateTime: number
}

export type GetOpenOrdersResponse = Order[]

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
}

export async function getOpenOrders({
  apiKey,
  secretKey,
  isTestnetAccount,
}: Props) {
  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/openOrders${query}`

  try {
    const response = await api<GetOpenOrdersResponse>({
      apiKey,
      isTestnetAccount,
      url,
    })

    return response
  } catch (error) {
    toast.error("Couldn't fetch your orders.", {
      description: error as string,
    })
  }
}
