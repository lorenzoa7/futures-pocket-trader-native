export const sides = ['LONG', 'SHORT'] as const
export type Sides = (typeof sides)[number]

export const closeLimitQuantityPercentages = [10, 25, 50, 75, 100] as const
export type CloseLimitQuantityPercentages =
  (typeof closeLimitQuantityPercentages)[number]
