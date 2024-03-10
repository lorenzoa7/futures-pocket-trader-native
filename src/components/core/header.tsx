import Logo from '@/assets/logo.png'
import { RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

export function Header() {
  return (
    <div className="flex items-center gap-2">
      <img src={Logo} width={24} height={24} />

      <h1 className="text-2xl font-semibold text-slate-50">
        <span className="text-amber-400">futures</span> pocket trader
      </h1>

      <TooltipProvider>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              onClick={() => location.reload()}
            >
              <RefreshCcw className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="dark:bg-slate-950">
            <p>Refresh application</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
