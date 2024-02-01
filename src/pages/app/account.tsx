import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { SignInSchema, signInSchema } from '@/schemas/sign-in-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function Account() {
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      apiKey,
      secretKey,
      isTestnetAccount,
    },
  })

  async function handleSignIn(data: SignInSchema) {
    useAccountStore.setState((state) => ({
      ...state,
      apiKey: data.apiKey,
      secretKey: data.secretKey,
      isTestnetAccount: data.isTestnetAccount,
    }))

    toast.success('Account saved!')
  }

  return (
    <div className="m-auto flex flex-col justify-center gap-6">
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(handleSignIn)}
        >
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your API key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your secret key</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isTestnetAccount"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center gap-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className="pb-2">
                  This is a testnet account
                </FormLabel>
              </FormItem>
            )}
          />

          <Button variant="secondary" type="submit" className="w-72">
            <SaveIcon className="mr-2 size-4" />
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
