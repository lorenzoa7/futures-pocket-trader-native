import { BadgeCentIcon, BookTextIcon, UserIcon } from 'lucide-react'
import { SiteRoutes, siteRoutes } from './routes'

export type NavItem = {
  title: string
  href: SiteRoutes[keyof SiteRoutes]
  icon: React.ElementType
}

export const navConfig: NavItem[] = [
  {
    title: 'Account',
    href: siteRoutes.account,
    icon: UserIcon,
  },
  {
    title: 'Create order',
    href: siteRoutes.createOrder,
    icon: BadgeCentIcon,
  },
  {
    title: 'Information',
    href: siteRoutes.information,
    icon: BookTextIcon,
  },
]

export const navTitles = {
  '/account': 'Account',
  '/create-order': 'Create order',
  '/information': 'Information',
} satisfies Record<SiteRoutes[keyof SiteRoutes], string>
