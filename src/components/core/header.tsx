import BitcoinIcon from '../icons/bitcoin-icon'

export function Header() {
  return (
    <div className="flex items-center gap-2">
      <BitcoinIcon width={20} height={20} className="mt-1.5" />
      <h1 className="text-2xl font-semibold text-slate-50">
        <span className="text-amber-400">my</span> pocket trader
      </h1>
    </div>
  )
}
