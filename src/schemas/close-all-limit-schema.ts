import { z } from 'zod'
import { singleOrderSchema } from './single-order-schema'

export const closeAllLimitSchema = z.object({
  orders: z.array(singleOrderSchema),
})

export type CloseAllLimitSchema = z.infer<typeof closeAllLimitSchema>
