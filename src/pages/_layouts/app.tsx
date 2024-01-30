import { Header } from '@/components/core/header'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="dark flex min-h-screen select-none flex-col bg-slate-900 p-10 text-slate-50 antialiased">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
