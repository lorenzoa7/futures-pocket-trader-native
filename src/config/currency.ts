export const sides = ['LONG', 'SHORT'] as const
export type Sides = (typeof sides)[number]
