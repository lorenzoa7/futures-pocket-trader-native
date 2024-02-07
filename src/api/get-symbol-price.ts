import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'

export type GetSymbolPriceResponse = {
  symbol: string
  price: string
  time: number
}

type Props = {
  symbol: string
  isTestnetAccount: boolean
}

export async function getSymbolPrice({ isTestnetAccount, symbol }: Props) {
  if (symbol === '') {
    return 0
  }

  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
    symbol,
  }

  const query = generateQueryString({ params })
  const url = `/fapi/v2/ticker/price${query}`

  const response = await api<GetSymbolPriceResponse>({
    isTestnetAccount,
    url,
    errorMessage: "Couldn't load the last price.",
  })

  return Number(response.price)
}
