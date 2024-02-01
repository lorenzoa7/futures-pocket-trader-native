import { appStorageKey, storageKeys } from '@/config/storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
}

export const useAccountStore = create<Props>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_) => ({
      apiKey: '',
      secretKey: '',
      isTestnetAccount: false,
    }),
    {
      name: `${appStorageKey}:${storageKeys.account}`,
    },
  ),
)
