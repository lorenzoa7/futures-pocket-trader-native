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
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function splitOrders({
  apiKey,
  secretKey,
  isTestnetAccount,
  data,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  try {
    const promises = Array.from({ length: data.ordersQuantity }).map(
      (_, index) => {
        const price =
          (1 - (data.dropPercentage / data.ordersQuantity / 100) * index) *
          data.price

        console.log(`PREÇO ${index + 1}: ${price}`)

        const params = {
          symbol: data.symbol,
          side: data.side,
          quantity: data.quantity,
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
      },
    )

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
