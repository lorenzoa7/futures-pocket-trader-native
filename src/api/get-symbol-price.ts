import { api } from '@/functions/api'

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

  const response = await api(isTestnetAccount).get<GetSymbolPriceResponse>(
    `/fapi/v2/ticker/price?symbol=${symbol}`,
  )

  return Number(response.data.price)
}
