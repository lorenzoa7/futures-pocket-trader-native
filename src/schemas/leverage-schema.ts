import { z } from 'zod'

export const leverageSchema = z.object({
  symbol: z.string().optional(),
  leverage: z.coerce.number().int().gte(1).lte(125),
})

export type LeverageSchema = z.infer<typeof leverageSchema>
