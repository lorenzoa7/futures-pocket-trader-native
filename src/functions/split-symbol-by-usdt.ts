export function splitSymbolByUSDT(symbol: string): [string, string] {
  const match = symbol.match(/^(.*?)(USDT)/)

  if (match) {
    const [, currency] = match
    return [currency, 'USDT']
  }

  return [symbol, 'USDT']
}
