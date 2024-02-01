import { api } from '@/functions/api'

export type GetSymbolsResponse = {
  symbols: { symbol: string }[]
}

type Props = {
  isTestnetAccount: boolean
}

export async function getSymbols({ isTestnetAccount }: Props) {
  const response = await api(isTestnetAccount).get<GetSymbolsResponse>(
    `/fapi/v1/exchangeInfo`,
  )

  return response.data.symbols.map((item) => item.symbol)
}
