export const siteRoutes = {
  account: '/account',
  createOrder: '/create-order',
  information: '/information',
} as const

export type SiteRoutes = typeof siteRoutes
