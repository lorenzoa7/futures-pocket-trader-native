import { api } from '@/functions/api'

export type GetSymbolsResponse = {
  symbols: { symbol: string }[]
}

type Props = {
  isTestnetAccount: boolean
}

export async function getSymbols({ isTestnetAccount }: Props) {
  const url = `/fapi/v1/exchangeInfo`
  const response = await api<GetSymbolsResponse>({
    isTestnetAccount,
    url,
    errorMessage:
      "Couldn't load coins. Try closing the app and opening it again.",
  })

  return response.symbols.map((item) => item.symbol)
}
