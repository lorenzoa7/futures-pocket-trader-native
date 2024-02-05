import { z } from 'zod'

export const createOrderSchema = z.object({
  symbol: z.string({
    required_error: 'Please select a symbol.',
  }),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  side: z.enum(['BUY', 'SELL']),
  isUsdtQuantity: z.boolean(),
})

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
