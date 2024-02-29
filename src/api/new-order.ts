import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { SingleOrderSchema } from '@/schemas/single-order-schema'
import { toast } from 'sonner'

export type NewOrderResponse = Record<string, string | number | boolean>

type LimitProps = {
  type: 'LIMIT'
  data: SingleOrderSchema
}

type MarketProps = {
  type: 'MARKET'
  data: Omit<SingleOrderSchema, 'price'>
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  noSuccessMessage?: boolean
  noErrorMessage?: boolean
  successMessage?: string
  errorMessage?: string
} & (LimitProps | MarketProps)

export async function newOrder(props: Props) {
  const {
    apiKey,
    isTestnetAccount,
    secretKey,
    type,
    noErrorMessage,
    noSuccessMessage,
  } = props

  const params =
    type === 'LIMIT'
      ? {
          symbol: props.data.symbol,
          side: props.data.side,
          quantity: props.data.quantity,
          price: props.data.price,
          type: props.type,
          timeInForce: 'GTC',
          recvWindow: defaultParams.recvWindow,
          timestamp: defaultParams.timestamp,
        }
      : {
          symbol: props.data.symbol,
          side: props.data.side,
          quantity: props.data.quantity,
          type: props.type,
          recvWindow: defaultParams.recvWindow,
          timestamp: defaultParams.timestamp,
        }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/order${query}`

  try {
    await api<NewOrderResponse>({
      method: 'post',
      apiKey,
      isTestnetAccount,
      url,
    })

    if (!noSuccessMessage) {
      toast.success(props.successMessage ?? 'New order created successfully!')
    }
  } catch (error) {
    if (!noErrorMessage) {
      toast.error(props.errorMessage ?? "Couldn't create a new order.", {
        description: error as string,
      })
    }
  }
}
