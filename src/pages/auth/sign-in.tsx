import BinanceIcon from '@/components/icons/binance-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ChevronRight } from 'lucide-react'

export function SignIn() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-6">
      <div className="flex items-baseline gap-2">
        <BinanceIcon width={20} height={20} />
        <h1 className="text-2xl font-semibold text-slate-50">
          <span className="text-amber-400">binance's</span> pocket trader
        </h1>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="apiKey">Your API key</Label>
          <Input id="apiKey" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="secretKey">Your secret key</Label>
          <Input id="secretKey" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Switch id="testnet-account" />
          <Label htmlFor="testnet-account">Connect in a testnet account</Label>
        </div>

        <Button variant="secondary" type="submit">
          Start using now
          <ChevronRight className="ml-2 size-4" />
        </Button>
      </form>
    </div>
  )
}
