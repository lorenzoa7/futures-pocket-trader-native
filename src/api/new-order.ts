import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { CreateOrderSchema } from '@/schemas/create-order-schema'

export type NewOrderResponse = Record<string, string | number | boolean>

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  data: CreateOrderSchema
}

export async function newOrder({
  apiKey,
  secretKey,
  isTestnetAccount,
  data,
}: Props) {
  const params = {
    symbol: data.symbol,
    side: data.side,
    quantity: data.quantity,
    price: data.price,
    type: 'LIMIT',
    timeInForce: 'GTC',
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/order${query}`

  await api<NewOrderResponse>({
    method: 'post',
    apiKey,
    isTestnetAccount,
    url,
    successMessage: 'New order created successfully!',
    errorMessage:
      "Couldn't create a new order. Check your account, the parameters and try again!",
  })
}
