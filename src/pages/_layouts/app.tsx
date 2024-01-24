import { useLayoutEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export function AppLayout() {
  const navigate = useNavigate()

  useLayoutEffect(() => {
    const isAuthenticated = localStorage.getItem('apiKey')
    if (!isAuthenticated) {
      navigate('/sign-in', {
        replace: true,
      })
    }
  }, [navigate])

  return (
    <div className="text-slate-50s dark flex min-h-screen select-none flex-col bg-slate-50 text-sm antialiased outline-none">
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
