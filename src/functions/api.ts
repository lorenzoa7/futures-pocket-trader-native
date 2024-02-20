type Props = {
  url: string
  isTestnetAccount: boolean
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete'
  body?: object
  apiKey?: string
}

export async function api<T extends object | unknown = unknown>({
  url,
  apiKey,
  isTestnetAccount,
  method = 'get',
  body,
}: Props) {
  return window.ipcRenderer
    .invoke('request', <T>{ url, apiKey, isTestnetAccount, method, body })
    .then((response) => {
      if (response.ok) {
        return response.data as T
      }

      return Promise.reject(response.message)
    })
}
