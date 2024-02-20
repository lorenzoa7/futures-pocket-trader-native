import { z } from 'zod'

export const singleOrderSchema = z.object({
  symbol: z.string({
    required_error: 'Please select a symbol.',
  }),
  price: z.coerce.number().gt(0),
  quantity: z.coerce.number().gt(0),
  side: z.enum(['BUY', 'SELL']),
  isUsdtQuantity: z.boolean(),
})

export type SingleOrderSchema = z.infer<typeof singleOrderSchema>
