import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { SplitOrderSchema } from '@/schemas/split-order-schema'
import { toast } from 'sonner'

export type NewOrderResponse = Record<string, string | number | boolean>

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  data: SplitOrderSchema
  prices: number[]
  sizes: number[]
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function splitOrders({
  apiKey,
  secretKey,
  isTestnetAccount,
  data,
  prices,
  sizes,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  try {
    const promises = prices.map((price, index) => {
      const params = {
        symbol: data.symbol,
        side: data.side,
        quantity: sizes[index],
        price,
        type: 'LIMIT',
        timeInForce: 'GTC',
        recvWindow: defaultParams.recvWindow,
        timestamp: defaultParams.timestamp,
      }

      const query = generateQueryString({ params, secretKey })
      const url = `/fapi/v1/order${query}`

      return api<NewOrderResponse>({
        method: 'post',
        apiKey,
        isTestnetAccount,
        url,
      })
    })

    await Promise.all(promises)

    if (dispatchSuccessMessage) {
      toast.success('Split orders created successfully!')
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't create all orders.", {
        description: error as string,
      })
    }
  }
}
