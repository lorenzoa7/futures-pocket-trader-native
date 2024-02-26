import { GetPositionResponse, getPositions } from '@/api/get-positions'
import { useQuery } from '@tanstack/react-query'
import { useAccountStore } from '../store/use-account-store'

type Props =
  | {
      onlyOpenPositions: boolean
    }
  | undefined

export const usePositionsQuery = (props: Props = undefined) => {
  const { isTestnetAccount, apiKey, secretKey } = useAccountStore()
  return useQuery({
    queryKey: ['positions'],
    queryFn: () =>
      getPositions({
        isTestnetAccount,
        apiKey,
        secretKey,
      }),
    select: (data: GetPositionResponse | undefined) => {
      if (props?.onlyOpenPositions) {
        return data?.filter((position) => Number(position.entryPrice) > 0)
      }

      return data
    },
  })
}
