import { ErrorCodes } from '@/config/connections'
import { Query, QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'

export function queryCacheOnError(
  _err: unknown,
  query: Query<unknown, unknown, unknown, QueryKey>,
) {
  switch (query.meta?.errorCode) {
    case ErrorCodes.SYMBOLS_FETCH_FAILED:
      toast.error(
        "Couldn't load coins. Try closing the app and opening it again.",
      )
      break
    case ErrorCodes.SYMBOL_PRICE_FETCH_FAILED:
      toast.error("Couldn't load the last price.")
      break
    case ErrorCodes.NEW_ORDER_FAILED:
      toast.error(
        "Couldn't create a new order. Check if the parameters are correct and try again!",
      )
      break
    default:
      toast.error(
        'Something went wrong. Try closing the app and opening it again.',
      )
  }
}
