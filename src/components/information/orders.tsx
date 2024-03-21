import { sides } from '@/config/currency'
import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { getOrderSide } from '@/functions/get-order-side'
import { useCancelAllOpenOrdersQuery } from '@/hooks/query/use-cancel-all-open-orders-query'
import { useCancelOrderQuery } from '@/hooks/query/use-cancel-order-query'
import { useOpenOrdersQuery } from '@/hooks/query/use-open-orders-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, RefreshCcw, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import Spinner from '../ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export function Orders() {
  const {
    data: orders,
    isPending: isPendingOrders,
    isFetching: isFetchingOrders,
  } = useOpenOrdersQuery()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { mutateAsync: cancelOrder, isPending: isPendingCancelOrder } =
    useCancelOrderQuery()
  const {
    mutateAsync: cancelAllOpenOrders,
    isPending: isPendingCancelAllOpenOrders,
  } = useCancelAllOpenOrdersQuery()
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const queryClient = useQueryClient()

  const openOrdersSymbols = orders
    ? [...new Set(orders.map((order) => order.symbol))]
    : []

  const form = useForm<InformationFilterSchema>({
    resolver: zodResolver(informationFilterSchema),
  })
  const { handleSubmit, setValue } = form

  const handleFilter = (data: InformationFilterSchema) => {
    setFilteredOrders((state) => {
      if (!state || !orders) {
        return state
      }

      return orders.filter(
        (order) =>
          (!data.symbol || data.symbol === order.symbol) &&
          (!data.side || data.side === getOrderSide(order.side)),
      )
    })
  }
  const formRef = useRef<HTMLFormElement>(null)

  const handleRefreshOrders = () => {
    setValue('symbol', undefined)
    setValue('side', undefined)
    queryClient.invalidateQueries({ queryKey: ['open-orders'] })
  }

  const [openSymbolFilter, setOpenSymbolFilter] = useState(false)
  const [openSideFilter, setOpenSideFilter] = useState(false)

  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFilter)} ref={formRef}>
          <Label>Filters</Label>
          <div className="my-2 flex gap-2">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover
                    open={openSymbolFilter}
                    onOpenChange={setOpenSymbolFilter}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between w-40',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? openOrdersSymbols.find(
                                (symbol) => symbol === field.value,
                              )
                            : 'Select symbol'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="dark w-40 border-slate-800 bg-transparent p-0">
                      <Command>
                        {isPendingOrders ? (
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
                                {openOrdersSymbols.map((symbol) => (
                                  <CommandItem
                                    value={symbol}
                                    key={symbol}
                                    onSelect={() => {
                                      const formSymbol =
                                        form.getValues('symbol')

                                      if (
                                        !formSymbol ||
                                        formSymbol !== symbol
                                      ) {
                                        form.setValue('symbol', symbol)
                                      } else {
                                        form.setValue('symbol', undefined)
                                      }

                                      if (formRef && formRef.current) {
                                        formRef.current.requestSubmit()
                                      }

                                      setOpenSymbolFilter(false)
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
              name="side"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover
                    open={openSideFilter}
                    onOpenChange={setOpenSideFilter}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between w-40',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? sides.find((side) => side === field.value)
                            : 'Select side'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="dark w-40 border-slate-800 bg-transparent p-0">
                      <Command>
                        <CommandGroup>
                          {sides.map((side) => (
                            <CommandItem
                              value={side}
                              key={side}
                              onSelect={() => {
                                const formSide = form.getValues('side')

                                if (!formSide || formSide !== side) {
                                  form.setValue('side', side)
                                } else {
                                  form.setValue('side', undefined)
                                }

                                if (formRef && formRef.current) {
                                  formRef.current.requestSubmit()
                                }

                                setOpenSideFilter(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  side === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {side}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={handleRefreshOrders}
            >
              <Filter className="size-5" />
            </Button> */}
            <div className="flex flex-1 justify-end pr-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleRefreshOrders}
              >
                <RefreshCcw
                  className={cn('size-4', isFetchingOrders && 'animate-spin')}
                />
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
        {isPendingOrders ? (
          <div className="flex w-full items-center justify-center">
            <Spinner className="mt-32 size-10" />
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <Table className="relative rounded-2xl" hasWrapper={false}>
            <TableHeader className="sticky top-0 z-10 w-full bg-slate-800">
              <TableRow>
                <TableHead className="w-52">Symbol</TableHead>
                <TableHead className="w-52">Side</TableHead>
                <TableHead className="w-52">Price</TableHead>
                <TableHead className="w-52 text-right">Amount</TableHead>
                <TableHead className="w-56 text-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="px-0 text-yellow-500 dark:hover:text-yellow-400"
                    onClick={() => {
                      if (orders) {
                        cancelAllOpenOrders({
                          apiKey,
                          isTestnetAccount,
                          secretKey,
                          queryClient,
                          symbols: orders.map((order) => order.symbol),
                        })
                      }
                    }}
                  >
                    {isPendingCancelAllOpenOrders ? (
                      <Spinner />
                    ) : (
                      <span>Cancel all</span>
                    )}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders
                .sort(
                  (orderA, orderB) =>
                    Number(orderB.price) * Number(orderB.origQty) -
                    Number(orderA.price) * Number(orderA.origQty),
                )
                .map((order, index) => {
                  const orderSide = getOrderSide(order.side)
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {order.symbol}
                      </TableCell>
                      <TableCell
                        data-long={orderSide === 'LONG'}
                        data-short={orderSide === 'SHORT'}
                        className="data-[long=true]:text-green-400 data-[short=true]:text-red-400"
                      >
                        {orderSide}
                      </TableCell>
                      <TableCell>{Number(order.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {`$ ${convertPriceToUsdt(Number(order.price), Number(order.origQty)).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="flex justify-center text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-4"
                          disabled={isPendingCancelOrder}
                          onClick={() => {
                            cancelOrder({
                              apiKey,
                              secretKey,
                              isTestnetAccount,
                              symbol: order.symbol,
                              orderId: order.orderId,
                              queryClient,
                            })
                          }}
                        >
                          {isPendingCancelOrder ? (
                            <Spinner className="size-4 fill-slate-50 text-slate-600" />
                          ) : (
                            <Trash2 className="size-4 text-slate-400 transition-colors hover:text-slate-50" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
            <TableFooter className="sticky -bottom-px z-10 dark:bg-slate-800">
              <TableRow>
                <TableCell colSpan={4}>Total (USDT)</TableCell>
                <TableCell className="text-right">
                  <span className="mr-1">$</span>
                  {filteredOrders
                    .reduce(
                      (total, order) =>
                        total + Number(order.origQty) * Number(order.price),
                      0,
                    )
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <div className="h-full w-[36.75rem] px-10 text-center">
            <Label>
              There are no open orders or <br />
              no open orders matches your filters.
            </Label>
          </div>
        )}
      </ScrollArea>
    </>
  )
}
