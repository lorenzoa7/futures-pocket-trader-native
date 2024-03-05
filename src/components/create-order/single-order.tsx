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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Spinner from '@/components/ui/spinner'
import { convertUsdtToPrice } from '@/functions/convert-usdt-to-price'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { splitSymbolByUSDT } from '@/functions/split-symbol-by-usdt'
import { useNewOrderQuery } from '@/hooks/query/use-new-order-query'
import { useSymbolPriceQuery } from '@/hooks/query/use-symbol-price-query'
import { useSymbolsQuery } from '@/hooks/query/use-symbols-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  SingleOrderSchema,
  singleOrderSchema,
} from '@/schemas/single-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { LeveragePopover } from './leverage-popover'
import { MarginTypePopover } from './margin-type-popover'

export function SingleOrder() {
  const form = useForm<SingleOrderSchema>({
    resolver: zodResolver(singleOrderSchema),
    defaultValues: {
      symbol: '',
      price: 0,
      quantity: 0,
      side: 'BUY',
      isUsdtQuantity: false,
    },
  })
  const watch = form.watch
  const setValue = form.setValue
  const isSubmitting = form.formState.isSubmitting
  const symbolWatch = watch('symbol')
  const isUsdtQuantity = watch('isUsdtQuantity')
  const side = watch('side')
  const [currencies, setCurrencies] = useState<string[]>([])

  const [open, setOpen] = useState(false)
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: symbols, isPending: isPendingSymbols } = useSymbolsQuery()
  const { data: lastPrice, isPending: isPendingPrice } =
    useSymbolPriceQuery(symbolWatch)
  const { mutate: newOrder, isPending: isPendingNewOrder } = useNewOrderQuery()

  async function handleCreateOrder(data: SingleOrderSchema) {
    const selectedSymbolData = symbols?.find(
      (symbol) => symbol.symbol === data.symbol,
    )

    const precision = selectedSymbolData && {
      quantity: selectedSymbolData.quantityPrecision,
      price: selectedSymbolData.pricePrecision,
      baseAsset: selectedSymbolData.baseAssetPrecision,
      quote: selectedSymbolData.quotePrecision,
    }

    if (!precision) {
      toast.error('Something went wrong. Check the parameters and try again!')
      return
    }

    data.quantity = data.isUsdtQuantity
      ? roundToDecimals(
          convertUsdtToPrice(data.quantity, data.price),
          precision.quantity || 0,
        )
      : roundToDecimals(data.quantity, precision.quantity || 0)

    const correctedPrice =
      data.price - (data.price % Number(selectedSymbolData.filters[0].tickSize))

    data.price = roundToDecimals(correctedPrice, precision.price || 0)

    if (data.quantity <= 0) {
      toast.error('Quantity is too low. Set a new quantity and try again.')
    } else {
      newOrder({
        apiKey,
        secretKey,
        isTestnetAccount,
        data,
        type: 'LIMIT',
      })
    }
  }

  useEffect(() => {
    if (lastPrice) {
      setValue('price', lastPrice)
    }

    if (symbolWatch && symbolWatch.length > 0) {
      setCurrencies(splitSymbolByUSDT(symbolWatch))
    }
  }, [lastPrice])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateOrder)}
        className="flex w-72 flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Symbol</FormLabel>

              <Popover open={open} onOpenChange={setOpen}>
                <div className="flex gap-2">
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between w-full truncate',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? symbols?.find(
                              (symbol) => symbol.symbol === field.value,
                            )?.symbol
                          : 'Select symbol'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  {symbolWatch && symbolWatch.length > 0 && (
                    <>
                      <LeveragePopover symbol={symbolWatch} />
                      <MarginTypePopover symbol={symbolWatch} />
                    </>
                  )}
                </div>
                <PopoverContent className="dark border-slate-800 bg-transparent p-0">
                  <Command>
                    {isPendingSymbols ? (
                      <div className="mx-auto flex items-center gap-2 py-3">
                        <Spinner />
                        <span>Loading currencies...</span>
                      </div>
                    ) : (
                      <>
                        <CommandInput
                          placeholder="Search symbol..."
                          className="border-slate-800"
                        />
                        <CommandEmpty>No symbol found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea viewportClassName="max-h-32">
                            {symbols?.map((symbol) => (
                              <CommandItem
                                value={symbol.symbol}
                                key={symbol.symbol}
                                onSelect={() => {
                                  form.setValue('symbol', symbol.symbol)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    symbol.symbol === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {symbol.symbol}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </>
                    )}
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
                <div className="relative">
                  <Input
                    type="number"
                    {...field}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {isPendingPrice ? (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Spinner />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-900 px-2 py-px text-sm font-medium duration-150 hover:bg-slate-900/50"
                      onClick={() => {
                        if (lastPrice) {
                          setValue('price', lastPrice)
                        }
                      }}
                    >
                      Last
                    </button>
                  )}
                </div>
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
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>
                {currencies.length > 0 && (
                  <Select
                    value={isUsdtQuantity ? currencies[1] : currencies[0]}
                    onValueChange={(value) => {
                      setValue('isUsdtQuantity', value === 'USDT')
                    }}
                  >
                    <SelectTrigger className="w-48 truncate">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-800 bg-slate-950 text-white">
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency}
                          value={currency}
                          className="focus:bg-slate-800 focus:text-white focus:hover:bg-slate-800 focus:hover:text-white"
                        >
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            variant="secondary"
            type="submit"
            className="flex w-full items-center gap-2 dark:bg-green-800 dark:hover:bg-green-800/80"
            onClick={() => setValue('side', 'BUY')}
            disabled={isPendingNewOrder || isSubmitting}
          >
            {(isPendingNewOrder || isSubmitting) && side === 'BUY' && (
              <Spinner className="fill-white text-slate-800" />
            )}
            Buy/Long
          </Button>
          <Button
            variant="secondary"
            type="submit"
            className="flex w-full items-center gap-2 dark:bg-red-800 dark:hover:bg-red-800/80"
            onClick={() => setValue('side', 'SELL')}
            disabled={isPendingNewOrder || isSubmitting}
          >
            {(isPendingNewOrder || isSubmitting) && side === 'SELL' && (
              <Spinner className="fill-white text-slate-800" />
            )}
            Sell/Short
          </Button>
        </div>
      </form>
    </Form>
  )
}
