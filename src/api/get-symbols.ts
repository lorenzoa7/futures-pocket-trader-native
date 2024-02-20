import { api } from '@/functions/api'
import { toast } from 'sonner'

export type GetSymbolsResponse = {
  symbols: { symbol: string }[]
}

type Props = {
  isTestnetAccount: boolean
}

export async function getSymbols({ isTestnetAccount }: Props) {
  const url = `/fapi/v1/exchangeInfo`

  try {
    const response = await api<GetSymbolsResponse>({
      isTestnetAccount,
      url,
    })

    return response.symbols.map((item) => item.symbol)
  } catch (error) {
    toast.error("Couldn't load coins.", {
      description: error as string,
    })
  }
}
