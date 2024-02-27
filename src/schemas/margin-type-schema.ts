import { z } from 'zod'

export const marginTypeSchema = z.object({
  symbol: z.string().optional(),
  marginType: z.enum(['ISOLATED', 'CROSSED']),
})

export type MarginTypeSchema = z.infer<typeof marginTypeSchema>
