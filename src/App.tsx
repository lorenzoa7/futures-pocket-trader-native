import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { queryClient } from './lib/react-query'
import { router } from './routes'

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
      <Toaster richColors />
    </PersistQueryClientProvider>
  )
}

export default App
