import BinanceIcon from '../icons/binance-icon'

export function Header() {
  return (
    <div className="flex items-baseline gap-2">
      <BinanceIcon width={20} height={20} />
      <h1 className="text-2xl font-semibold text-slate-50">
        <span className="text-amber-400">binance's</span> pocket trader
      </h1>
    </div>
  )
}
