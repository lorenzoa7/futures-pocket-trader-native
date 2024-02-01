import { z } from 'zod'

export const accountStorageSchema = z.object({
  state: z.object({
    apiKey: z.string().min(1, 'This field is required.'),
    secretKey: z.string().min(1, 'This field is required.'),
    isTestnetAccount: z.boolean(),
  }),
})

export type AccountStorageSchema = z.infer<typeof accountStorageSchema>
