import { getSignature } from '@/functions/get-signature'
import { CreateOrderSchema } from '@/schemas/create-order-schema'

export type NewOrderResponse = Record<string, string | number | boolean>

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  data: CreateOrderSchema
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectToString(obj: Record<any, any>) {
  const keys = Object.keys(obj)
  const keyValuePairs = keys.map((key) => `${key}=${obj[key]}`)
  return keyValuePairs.join('&')
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
    recvWindow: 100000,
    timestamp: Date.now(),
  }

  const query = objectToString(params)
  const signature = getSignature({ params, secretKey })
  // api(isTestnetAccount).get<NewOrderResponse>(
  //   `/fapi/v1/order?symbol=${params.symbol}&side=${params.side}&type=${params.type}&timeInForce=${params.timeInForce}&quantity=${params.quantity}&price=${params.price}&signature=${signature}&recvWindow=${params.recvWindow}&timestamp=${params.timestamp}`,
  //   {
  //     headers: {
  //       'X-MBX-APIKEY': apiKey,
  //     },
  //   },
  // ),

  window.ipcRenderer.invoke('request', { query, signature, apiKey })
}
