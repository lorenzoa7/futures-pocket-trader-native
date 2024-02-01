import { defaultParams } from '@/config/connections'
import { api } from '@/functions/api'
import { getSignature } from '@/functions/get-signature'

export type GetAccountInformationResponse = Record<
  string,
  string | number | boolean
>

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
}

export async function getAccountInformation({
  apiKey,
  secretKey,
  isTestnetAccount,
}: Props) {
  const params = defaultParams
  const signature = getSignature({ params, secretKey })

  const response = await api(
    isTestnetAccount,
  ).get<GetAccountInformationResponse>(
    `/fapi/v2/account?recvWindow=${params.recvWindow}&timestamp=${params.timestamp}&signature=${signature}`,
    {
      headers: {
        'X-MBX-APIKEY': apiKey,
      },
    },
  )
  return response.data
}
