import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { queryClient } from './lib/react-query'
import { router } from './routes'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        richColors
        position="top-right"
        expand={true}
        visibleToasts={1}
        toastOptions={{
          style: {
            backgroundColor: '#1e293b',
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
