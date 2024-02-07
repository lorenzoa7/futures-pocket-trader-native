import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { generateQueryString } from '@/functions/generate-query-string'

export type Position = {
  symbol: string
  positionAmt: string
  entryPrice: string
  breakEvenPrice: string
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  leverage: string
  maxNotionalValue: string
  marginType: string
  isolatedMargin: string
  isAutoAddMargin: 'false' | 'true'
  positionSide: 'LONG' | 'SHORT' | 'BOTH'
  notional: string
  isolatedWallet: string
  updateTime: number
  isolated: boolean
  adlQuantile: number
}

export type GetPositionResponse = Position[]

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
}

export async function getPositions({
  apiKey,
  secretKey,
  isTestnetAccount,
}: Props) {
  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const url = `/fapi/v2/positionRisk${query}`

  const response = await api<GetPositionResponse>({
    apiKey,
    isTestnetAccount,
    url,
    errorMessage:
      "Couldn't fetch your positions. Check if your account information is correct and reopen the app!",
  })

  return response.filter((position) => Number(position.positionAmt) > 0)
}
