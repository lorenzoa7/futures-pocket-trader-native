import { BadgeCentIcon, BookTextIcon, UserIcon } from 'lucide-react'
import { SiteRoutes, siteRoutes } from './routes'

export type NavItem = {
  href: SiteRoutes[keyof SiteRoutes]
  icon: React.ElementType
}

export const navConfig: NavItem[] = [
  {
    href: siteRoutes.account,
    icon: UserIcon,
  },
  {
    href: siteRoutes.createOrder,
    icon: BadgeCentIcon,
  },
  {
    href: siteRoutes.information,
    icon: BookTextIcon,
  },
]

export const navTitles = {
  '/account': 'Account',
  '/create-order': 'Create order',
  '/information': 'Information',
} satisfies Record<SiteRoutes[keyof SiteRoutes], string>
