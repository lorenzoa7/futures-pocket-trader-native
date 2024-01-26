import crypto from 'crypto'

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

  return crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex')
}
