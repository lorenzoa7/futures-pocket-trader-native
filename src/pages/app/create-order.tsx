import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNewOrderQuery } from '@/hooks/query/use-new-order-query'
import { useSymbolPriceQuery } from '@/hooks/query/use-symbol-price-query'
import { useSymbolsQuery } from '@/hooks/query/use-symbols-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  CreateOrderSchema,
  createOrderSchema,
} from '@/schemas/create-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CreateOrder() {
  const form = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      symbol: '',
      price: 0,
      quantity: 0,
      side: 'BUY',
    },
  })
  const watch = form.watch
  const setValue = form.setValue
  const symbolWatch = watch('symbol')

  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: symbols } = useSymbolsQuery()
  const { data: lastPrice } = useSymbolPriceQuery(symbolWatch)
  const { mutateAsync: newOrder } = useNewOrderQuery()

  async function handleCreateOrder(data: CreateOrderSchema) {
    try {
      await newOrder({ apiKey, secretKey, isTestnetAccount, data })

      toast.success('New order created successfully!')
    } catch (error) {
      console.error(error)
      toast.error(
        "Couldn't create a new order. Check if the parameters are correct and try again!",
      )
    }
  }

  useEffect(() => {
    if (lastPrice) {
      setValue('price', lastPrice)
    }
  }, [lastPrice])

  return (
    <div className="m-auto flex flex-col justify-center gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateOrder)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Symbol</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? symbols?.find((symbol) => symbol === field.value)
                          : 'Select symbol'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="dark border-slate-800 bg-transparent p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search symbol..."
                        className="border-slate-800"
                      />
                      <CommandEmpty>No symbol found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-32">
                          {symbols?.map((symbol) => (
                            <CommandItem
                              value={symbol}
                              key={symbol}
                              onSelect={() => {
                                form.setValue('symbol', symbol)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  symbol === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {symbol}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              variant="secondary"
              type="submit"
              className="w-36 dark:bg-green-800 dark:hover:bg-green-800/80"
              onClick={() => setValue('side', 'BUY')}
            >
              Buy
            </Button>
            <Button
              variant="secondary"
              type="submit"
              className="w-36 dark:bg-red-800 dark:hover:bg-red-800/80"
              onClick={() => setValue('side', 'SELL')}
            >
              Sell
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
