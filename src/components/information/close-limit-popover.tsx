import { closeLimitQuantityPercentages } from '@/config/currency'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { stopPropagate } from '@/functions/stop-propagate'
import { useSymbolPriceQuery } from '@/hooks/query/use-symbol-price-query'
import {
  SingleOrderSchema,
  singleOrderSchema,
} from '@/schemas/single-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
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
import Spinner from '../ui/spinner'

type Props = {
  quantity: number
  symbol: string
  side: 'LONG' | 'SHORT' | 'BOTH'
  isPending: boolean
  quantityPrecision: number
  handleSubmit: (data: SingleOrderSchema) => Promise<void>
}

export function CloseLimitPopover({
  quantity,
  symbol,
  side,
  isPending,
  quantityPrecision,
  handleSubmit,
}: Props) {
  const [open, setOpen] = useState(false)
  const { data: lastPrice, isPending: isPendingPrice } =
    useSymbolPriceQuery(symbol)
  const form = useForm<SingleOrderSchema>({
    resolver: zodResolver(singleOrderSchema),
    defaultValues: {
      symbol,
      price: 0,
      quantity,
      side: side === 'LONG' ? 'SELL' : 'BUY',
      isUsdtQuantity: false,
    },
  })

  const { setValue } = form

  useEffect(() => {
    if (lastPrice) {
      setValue('price', lastPrice)
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="link"
          disabled={isPending || isPendingPrice}
          className="h-4 px-0 dark:text-yellow-500 dark:hover:text-yellow-400"
        >
          Limit
        </Button>
      </PopoverTrigger>
      <PopoverContent className="dark border-slate-800 bg-slate-950 text-slate-50">
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSubmit))}
            className="space-y-2"
          >
            <div className="mb-3 space-y-2">
              <h4 className="font-medium leading-none">Limit</h4>
              <p className="text-muted-foreground text-sm">
                Close {symbol} position at limit price.
              </p>
            </div>

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
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="[&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <div className="flex items-center gap-1">
                      {closeLimitQuantityPercentages.map((percentage) => (
                        <Button
                          key={percentage}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-12 px-2 text-sm"
                          onClick={() => {
                            setValue(
                              'quantity',
                              roundToDecimals(
                                quantity * (percentage / 100),
                                quantityPrecision,
                              ),
                            )
                          }}
                          disabled={isPending || isPendingPrice}
                        >
                          {percentage}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-32 items-center gap-2 border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-slate-50"
              variant="outline"
              disabled={isPending || isPendingPrice}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {isPending && <Spinner className="fill-white text-slate-800" />}
              Confirm
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
