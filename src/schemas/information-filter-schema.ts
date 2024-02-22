import { z } from 'zod'

export const informationFilterSchema = z.object({
  symbol: z.string().optional(),
  side: z.enum(['LONG', 'SHORT']).optional(),
})

export type InformationFilterSchema = z.infer<typeof informationFilterSchema>
