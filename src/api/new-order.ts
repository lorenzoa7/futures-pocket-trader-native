import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { getSignature } from '@/functions/get-signature'
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
    ...defaultParams,
    symbol: data.symbol,
    side: data.side,
    quantity: data.quantity,
    price: data.price,
    type: 'LIMIT',
    timeInForce: 'GTC',
  }
  const signature = getSignature({ params, secretKey })

  api(isTestnetAccount).get<NewOrderResponse>(
    `/fapi/v1/order?symbol=${params.symbol}&side=${params.side}&type=${params.type}&timeInForce=${params.timeInForce}&quantity=${params.quantity}&price=${params.price}&signature=${signature}&recvWindow=${params.recvWindow}&timestamp=${params.timestamp}`,
    {
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    },
  )
}
