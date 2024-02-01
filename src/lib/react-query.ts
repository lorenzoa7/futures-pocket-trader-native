import { queryCacheOnError } from '@/functions/query-cache-on-error'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

let displayedNetworkFailureError = false

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount) {
        if (failureCount >= 3) {
          if (displayedNetworkFailureError === false) {
            displayedNetworkFailureError = true

            toast.error(
              'The application is taking longer than expected to load, please try again later.',
              {
                onDismiss: () => {
                  displayedNetworkFailureError = false
                },
              },
            )
          }

          return false
        }

        return true
      },
    },
  },
  queryCache: new QueryCache({
    onError: queryCacheOnError,
  }),
})
