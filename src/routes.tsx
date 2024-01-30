import { createBrowserRouter } from 'react-router-dom'
import { NotFound } from './pages/404'
import { AppLayout } from './pages/_layouts/app'
import { Main } from './pages/app'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
    ],
  },
])
