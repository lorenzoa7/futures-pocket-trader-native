import { navConfig, navTitles } from '@/config/nav'
import { SiteRoutes } from '@/config/routes'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export function NavBar() {
  const location = useLocation()
  const pathname = location.pathname as SiteRoutes[keyof SiteRoutes]
  return (
    <nav className="mx-auto flex flex-col gap-3 text-slate-50">
      <div className="relative rounded-xl bg-slate-800 text-center">
        <span className="font-semibold">{navTitles[pathname]}</span>
        <div className="absolute left-1/2 size-0 -translate-x-1/2 border-x-4 border-t-8 border-x-transparent border-t-slate-800" />
      </div>

      <div className="z-20 flex w-fit rounded-full bg-slate-800">
        {navConfig.map(({ href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            data-active={href === pathname}
            className="relative rounded-full bg-transparent p-3 duration-300 drag-none hover:bg-slate-700/50"
          >
            <Icon className="z-10 size-8" />

            {href === pathname && (
              <motion.span
                className="absolute inset-0 -z-10 rounded-full bg-slate-700 p-3 "
                layoutId="activePage"
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
