import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="dark container grid min-h-screen select-none flex-col items-center justify-center bg-slate-900 text-slate-50 antialiased">
      <Outlet />
    </div>
  )
}
