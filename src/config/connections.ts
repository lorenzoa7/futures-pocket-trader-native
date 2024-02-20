export const defaultParams = {
  recvWindow: 6000000,
  timestamp: Date.now(),
}

export const enum ErrorCodes {
  SYMBOLS_FETCH_FAILED,
  SYMBOL_PRICE_FETCH_FAILED,
  NEW_ORDER_FAILED,
}
