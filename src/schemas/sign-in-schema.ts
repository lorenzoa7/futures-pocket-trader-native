import { z } from 'zod'

export const signInSchema = z.object({
  apiKey: z.string().min(1, 'This field is required.'),
  secretKey: z.string().min(1, 'This field is required.'),
  isTestnetAccount: z.boolean(),
})

export type SignInSchema = z.infer<typeof signInSchema>
