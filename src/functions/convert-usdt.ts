export function convertUsdt(
  quantity: number,
  price: number,
  decimalPlaces = 2,
) {
  console.log(quantity / price)
  return parseFloat((quantity / price).toFixed(decimalPlaces))
}
