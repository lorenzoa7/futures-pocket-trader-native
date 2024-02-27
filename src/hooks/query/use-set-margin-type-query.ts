import { setMarginType } from '@/api/set-margin-type'
import { useMutation } from '@tanstack/react-query'

export const useSetMarginTypeQuery = () => {
  return useMutation({
    mutationFn: setMarginType,
  })
}
