import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const futuresApi = axios.create({
  baseURL: 'https://fapi.binance.com',
})

export const testnetFuturesApi = axios.create({
  baseURL: 'https://testnet.binancefuture.com',
})
