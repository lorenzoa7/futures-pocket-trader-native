import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { MarginTypeSchema } from '@/schemas/margin-type-schema'
import { toast } from 'sonner'

export type SetMarginTypeResponse = {
  code: number
  msg: string
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  data: MarginTypeSchema
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function setMarginType({
  apiKey,
  secretKey,
  isTestnetAccount,
  data,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  const params = {
    symbol: data.symbol,
    marginType: data.marginType,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/marginType${query}`

  try {
    await api<SetMarginTypeResponse>({
      method: 'post',
      apiKey,
      isTestnetAccount,
      url,
    })

    if (dispatchSuccessMessage) {
      toast.success(`Margin type for ${data.symbol} was set!`)
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't set the margin type.", {
        description: error as string,
      })
    }
  }
}
