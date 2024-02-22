import { sides } from '@/config/currency'
import { getOrderSide } from '@/functions/get-order-side'
import { useOpenOrdersQuery } from '@/hooks/query/use-open-orders-query'
import { cn } from '@/lib/utils'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
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
  const { data: orders, isPending: isPendingOrders } = useOpenOrdersQuery()
  const [filteredOrders, setFilteredOrders] = useState(orders)

  const openOrdersSymbols = orders ? orders.map((order) => order.symbol) : []

  const form = useForm<InformationFilterSchema>({
    resolver: zodResolver(informationFilterSchema),
  })

  const watch = form.watch
  const handleSubmit = form.handleSubmit

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

  const [openSymbolFilter, setOpenSymbolFilter] = useState(false)
  const [openSideFilter, setOpenSideFilter] = useState(false)

  useEffect(() => {
    const subscription = watch(() => handleSubmit(handleFilter)())
    return () => subscription.unsubscribe()
  }, [handleSubmit, watch])

  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFilter)}>
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
                        {`$ ${(Number(order.price) * Number(order.origQty)).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
            <TableFooter className="sticky bottom-0 z-10 dark:bg-slate-800">
              <TableRow>
                <TableCell colSpan={3}>Total (USDT)</TableCell>
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
          <div className="h-full w-[30.5rem] px-10 text-center">
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
