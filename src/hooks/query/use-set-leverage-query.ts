import { setLeverage } from '@/api/set-leverage'
import { useMutation } from '@tanstack/react-query'

export const useSetLeverageQuery = () => {
  return useMutation({
    mutationFn: setLeverage,
  })
}
