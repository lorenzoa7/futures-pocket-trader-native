import { futuresApi, testnetFuturesApi } from '@/lib/axios'

export function api(isTestnetAccount: boolean) {
  if (isTestnetAccount) {
    return testnetFuturesApi
  }

  return futuresApi
}
