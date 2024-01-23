import { Bitcoin } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center antialiased md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="border-foreground/5 bg-muted text-muted-foreground relative hidden h-full flex-col border-r p-10 dark:border-r lg:flex">
        <div className="text-foreground flex items-center gap-3 text-lg font-medium">
          <Bitcoin className="size-5" />
          <span className="font-semibold">Binance Order Assistant</span>
        </div>
        <div className="mt-auto">
          <footer className="text-sm">
            Main panel &copy; Binance Order Assistant -{' '}
            {new Date().getFullYear()}
          </footer>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  )
}
