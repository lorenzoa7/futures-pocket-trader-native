export function getOrderSide(side: 'BUY' | 'SELL') {
  switch (side) {
    case 'BUY':
      return 'LONG'
    case 'SELL':
      return 'SHORT'
    default:
      return 'LONG'
  }
}
