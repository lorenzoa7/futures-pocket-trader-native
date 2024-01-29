import CryptoJS from 'crypto-js'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  params: Record<string, any>
  secretKey: string
}

export function getSignature({ params, secretKey }: Props) {
  const queryString = Object.keys(params)
    .map((key) => {
      return `${encodeURIComponent(key)}=${params[key]}`
    })
    .join('&')
  console.log(queryString)

  return CryptoJS.HmacSHA256(queryString, secretKey).toString()
}
