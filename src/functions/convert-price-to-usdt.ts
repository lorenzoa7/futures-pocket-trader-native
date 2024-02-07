export function convertPriceToUsdt(
  quantity: number,
  price: number,
  decimalPlaces = 2,
) {
  return parseFloat((quantity * price).toFixed(decimalPlaces))
}
