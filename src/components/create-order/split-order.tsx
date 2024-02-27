import { convertUsdtToPrice } from '@/functions/convert-usdt-to-price'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { splitSymbolByUSDT } from '@/functions/split-symbol-by-usdt'
import { useSplitOrdersQuery } from '@/hooks/query/use-split-orders-query'
import { useSymbolPriceQuery } from '@/hooks/query/use-symbol-price-query'
import { useSymbolsQuery } from '@/hooks/query/use-symbols-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  SplitOrderSchema,
  splitOrderSchema,
} from '@/schemas/split-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Slider } from '../ui/slider'
import Spinner from '../ui/spinner'
import { LeveragePopover } from './leverage-popover'
import { MarginTypePopover } from './margin-type-popover'

export function SplitOrder() {
  const form = useForm<SplitOrderSchema>({
    resolver: zodResolver(splitOrderSchema),
    defaultValues: {
      symbol: '',
      price: 0,
      size: 0,
      side: 'BUY',
      isUsdtQuantity: false,
      ordersQuantity: 2,
      dropPercentage: 10,
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
  const queryClient = useQueryClient()
  const { mutate: splitOrders, isPending: isPendingSplitOrder } =
    useSplitOrdersQuery()

  async function handleCreateSplitOrder(data: SplitOrderSchema) {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['symbol-price', symbolWatch],
      }),
      queryClient.invalidateQueries({ queryKey: ['positions'] }),
    ])

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
    } else {
      data.size =
        lastPrice && data.isUsdtQuantity
          ? roundToDecimals(
              convertUsdtToPrice(data.size, lastPrice),
              precision?.quantity || 0,
            )
          : roundToDecimals(data.size, precision?.quantity || 0)

      data.price = roundToDecimals(data.price, precision?.price || 0)

      if (data.size <= 0) {
        toast.error('Size is too low. Set a new size and try again.')
      } else {
        splitOrders({
          apiKey,
          secretKey,
          isTestnetAccount,
          data,
          pricePrecision: precision.price,
        })
      }
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
        onSubmit={form.handleSubmit(handleCreateSplitOrder)}
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
                          <ScrollArea className="h-32">
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
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
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

        <FormField
          control={form.control}
          name="ordersQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orders quantity</FormLabel>
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
          name="dropPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drop percentage - {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={99}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => {
                    field.onChange(vals[0])
                  }}
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
            className="flex w-full items-center gap-2 dark:bg-green-800 dark:hover:bg-green-800/80"
            onClick={() => setValue('side', 'BUY')}
            disabled={isPendingSplitOrder || isSubmitting}
          >
            {(isPendingSplitOrder || isSubmitting) && side === 'BUY' && (
              <Spinner className="fill-white text-slate-800" />
            )}
            Buy/Long
          </Button>
          <Button
            variant="secondary"
            type="submit"
            className="flex w-full items-center gap-2 dark:bg-red-800 dark:hover:bg-red-800/80"
            onClick={() => setValue('side', 'SELL')}
            disabled={isPendingSplitOrder || isSubmitting}
          >
            {(isPendingSplitOrder || isSubmitting) && side === 'SELL' && (
              <Spinner className="fill-white text-slate-800" />
            )}
            Sell/Short
          </Button>
        </div>
      </form>
    </Form>
  )
}
