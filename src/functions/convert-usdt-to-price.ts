export function convertUsdtToPrice(
  quantity: number,
  price: number,
  decimalPlaces = 2,
) {
  return parseFloat((quantity / price).toFixed(decimalPlaces))
}
