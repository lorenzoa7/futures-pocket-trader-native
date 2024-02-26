import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'
import { LeverageSchema } from '@/schemas/leverage-schema'
import { toast } from 'sonner'

export type SetLeverageResponse = {
  leverage: number
  maxNotionalValue: string
  symbol: string
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  data: LeverageSchema
  dispatchSuccessMessage?: boolean
  dispatchErrorMessage?: boolean
}

export async function setLeverage({
  apiKey,
  secretKey,
  isTestnetAccount,
  data,
  dispatchSuccessMessage = true,
  dispatchErrorMessage = true,
}: Props) {
  const params = {
    symbol: data.symbol,
    leverage: data.leverage,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v1/leverage${query}`

  try {
    await api<SetLeverageResponse>({
      method: 'post',
      apiKey,
      isTestnetAccount,
      url,
    })

    if (dispatchSuccessMessage) {
      toast.success(`Leverage for ${data.symbol} was set!`)
    }
  } catch (error) {
    if (dispatchErrorMessage) {
      toast.error("Couldn't set the leverage.", {
        description: error as string,
      })
    }
  }
}
