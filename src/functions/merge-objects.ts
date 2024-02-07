/* eslint-disable @typescript-eslint/no-explicit-any */
export function mergeObjects<T extends Record<string, any>>(
  ...objects: T[]
): T {
  return objects.reduce((acc, obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (!(key in acc)) {
        acc[key as keyof T] = value as T[keyof T]
      }
    })
    return acc
  }, {} as T)
}
