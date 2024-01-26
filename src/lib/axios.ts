import { enableApiDelay } from '@/config/connections'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://testnet.binancefuture.com',
})

if (enableApiDelay) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 4000)),
    )

    return config
  })
}
