import { Navigate, createMemoryRouter } from 'react-router-dom'
import { siteRoutes } from './config/routes'
import { NotFound } from './pages/404'
import { AppLayout } from './pages/_layouts/app'
import { Account } from './pages/app/account'
import { CreateOrder } from './pages/app/create-order'
import { Information } from './pages/app/information'

export const router = createMemoryRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Navigate replace to={siteRoutes.account} />,
      },
      {
        path: siteRoutes.account,
        element: <Account />,
      },
      {
        path: siteRoutes.createOrder,
        element: <CreateOrder />,
      },
      {
        path: siteRoutes.information,
        element: <Information />,
      },
    ],
  },
])
