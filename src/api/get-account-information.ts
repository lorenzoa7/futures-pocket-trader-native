import { getSignature } from '@/functions/get-signature'
import { api } from '@/lib/axios'

export type GetAccountInformationResponse = Record<
  string,
  string | number | boolean
>

export async function getAccountInformation(apiKey: string, secretKey: string) {
  console.log('fui chamado')
  const params = {
    recvWindow: 5000,
    timestamp: Date.now(),
  }
  const response = await api.get<GetAccountInformationResponse>(
    `/fapi/v2/account?recvWindow=${params.recvWindow}&timestamp=${params.timestamp}&signature=${getSignature({ params, secretKey })}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': apiKey,
      },
    },
  )

  return response.data
}
