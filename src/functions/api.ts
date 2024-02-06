import { toast } from 'sonner'

type Props = {
  url: string
  isTestnetAccount: boolean
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  successMessage?: string
  errorMessage?: string
  body?: object
  apiKey?: string
  noMessages?: boolean
}

export async function api<T extends object | unknown = unknown>({
  url,
  apiKey,
  isTestnetAccount,
  method = 'get',
  errorMessage = 'Something went wrong. Try closing the app and opening it again.',
  successMessage,
  body,
  noMessages = false,
}: Props) {
  return window.ipcRenderer
    .invoke('request', <T>{ url, apiKey, isTestnetAccount, method, body })
    .then((response: T) => {
      if (successMessage && !noMessages) {
        toast.success(successMessage)
      }

      return response
    })
    .catch((error) => {
      if (!noMessages) {
        toast.error(errorMessage)
      }

      return Promise.reject(error)
    })
}
