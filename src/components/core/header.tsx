import Logo from '@/assets/logo.png'

export function Header() {
  return (
    <div className="flex items-center gap-2">
      <img src={Logo} width={24} height={24} className="mt-1.5" />
      <h1 className="text-2xl font-semibold text-slate-50">
        <span className="text-amber-400">futures</span> pocket trader
      </h1>
    </div>
  )
}
