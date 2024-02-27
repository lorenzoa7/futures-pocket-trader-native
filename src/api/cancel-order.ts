import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { toast } from 'sonner'
import { SetLeverageResponse } from './set-leverage'

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
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function cancelOrder({
  apiKey,
  secretKey,
  isTestnetAccount,
  symbol,
  orderId,
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
    await api<SetLeverageResponse>({
      method: 'delete',
      apiKey,
      isTestnetAccount,
      url,
    })

    if (dispatchSuccessMessage) {
      toast.success(`Order canceled successfully`)
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't cancel the order.", {
        description: error as string,
      })
    }
  }
}
