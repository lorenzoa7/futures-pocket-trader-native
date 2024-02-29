import { z } from 'zod'

export const closeLimitSchema = z.object({
  price: z.coerce.number().gt(0),
  quantity: z.coerce.number().gt(0),
})

export type CloseLimitSchema = z.infer<typeof closeLimitSchema>
