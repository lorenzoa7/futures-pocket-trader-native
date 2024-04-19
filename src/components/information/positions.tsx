import { Position } from '@/api/get-positions'
import { sides } from '@/config/currency'
import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { getPositionSide } from '@/functions/get-position-side'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { useNewOrderQuery } from '@/hooks/query/use-new-order-query'
import { usePositionsQuery } from '@/hooks/query/use-position-information-query'
import { useSymbolsPriceQueries } from '@/hooks/query/use-symbols-price-queries'
import { useSymbolsQuery } from '@/hooks/query/use-symbols-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import { CloseAllLimitSchema } from '@/schemas/close-all-limit-schema'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { SingleOrderSchema } from '@/schemas/single-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, ChevronsUpDown, RefreshCcw, X } from 'lucide-react'
import { useRef, useState } from 'react'
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
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
import {
  CloseAllLimitPopover,
  SymbolInformation,
} from './close-all-limit-popover'
import { CloseLimitPopover } from './close-limit-popover'

export function Positions() {
  const { mutateAsync: newOrder, isPending: isPendingNewOrder } =
    useNewOrderQuery()
  const {
    data: positions,
    isPending: isPendingPositions,
    isFetching: isFetchingPositions,
  } = usePositionsQuery({
    onlyOpenPositions: true,
  })
  // const [filteredPositions, setFilteredPositions] = useState(positions)
  const [filter, setFilter] = useState<InformationFilterSchema>({
    side: undefined,
    symbol: undefined,
  })
  const filteredPositions = positions?.filter(
    (position) =>
      (!filter.symbol || filter.symbol === position.symbol) &&
      (!filter.side ||
        filter.side === getPositionSide(Number(position.notional))),
  )

  const queryClient = useQueryClient()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: symbols } = useSymbolsQuery()

  const openPositionsSymbols = positions
    ? positions.map((position) => position.symbol)
    : []

  const { data: prices, isPending: isPendingSymbolsPrices } =
    useSymbolsPriceQueries(
      filteredPositions
        ? [...new Set(filteredPositions.map((position) => position.symbol))]
        : [],
    )

  const form = useForm<InformationFilterSchema>({
    resolver: zodResolver(informationFilterSchema),
  })
  const { handleSubmit, setValue } = form

  const handleFilter = (data: InformationFilterSchema) => {
    setFilter(data)
  }

  const handleCloseAll = async () => {
    const dataList: Omit<SingleOrderSchema, 'price'>[] =
      positions?.map((position) => ({
        symbol: position.symbol,
        isUsdtQuantity: false,
        quantity: Math.abs(Number(position.positionAmt)),
        side:
          getPositionSide(Number(position.notional)) === 'LONG'
            ? 'SELL'
            : 'BUY',
      })) ?? []

    const promises = dataList.map((data) =>
      newOrder({
        apiKey,
        isTestnetAccount,
        secretKey,
        data,
        type: 'MARKET',
        successMessage: 'Close market order created successfully!',
        errorMessage: "Couldn't create a close market order.",
      }),
    )

    await Promise.all(promises)
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['open-orders'],
      }),
      queryClient.invalidateQueries({ queryKey: ['positions'] }),
    ])
  }

  const handleCloseMarket = async (position: Position) => {
    const data: Omit<SingleOrderSchema, 'price'> = {
      symbol: position.symbol,
      isUsdtQuantity: false,
      quantity: Math.abs(Number(position.positionAmt)),
      side:
        getPositionSide(Number(position.notional)) === 'LONG' ? 'SELL' : 'BUY',
    }

    await newOrder({
      apiKey,
      isTestnetAccount,
      secretKey,
      data,
      queryClient,
      type: 'MARKET',
      successMessage: 'Close market order created successfully!',
      errorMessage: "Couldn't create a close market order.",
    })
  }

  const handleCloseLimit = async (data: SingleOrderSchema) => {
    const symbolData = symbols?.find((item) => item.symbol === data.symbol)
    const precision = symbolData && {
      quantity: symbolData.quantityPrecision,
      price: symbolData.pricePrecision,
      baseAsset: symbolData.baseAssetPrecision,
      quote: symbolData.quotePrecision,
    }

    data.quantity = roundToDecimals(data.quantity, precision?.quantity || 0)
    data.price = roundToDecimals(data.price, precision?.price || 0)

    await newOrder({
      apiKey,
      isTestnetAccount,
      secretKey,
      data,
      queryClient,
      type: 'LIMIT',
      successMessage: 'Close limit order created successfully!',
      errorMessage: "Couldn't create a close limit order.",
    })
  }

  const handleCloseAllLimit = async ({ orders }: CloseAllLimitSchema) => {
    console.log(orders)
    const promises = orders.map(async (data) => {
      const symbolData = symbols?.find((item) => item.symbol === data.symbol)
      const precision = symbolData && {
        quantity: symbolData.quantityPrecision,
        price: symbolData.pricePrecision,
        baseAsset: symbolData.baseAssetPrecision,
        quote: symbolData.quotePrecision,
      }

      data.quantity = roundToDecimals(data.quantity, precision?.quantity || 0)
      data.price = roundToDecimals(data.price, precision?.price || 0)

      return newOrder({
        apiKey,
        isTestnetAccount,
        secretKey,
        data,
        queryClient,
        type: 'LIMIT',
        noSuccessMessage: true,
      })
    })

    try {
      await Promise.all(promises)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['open-orders'],
        }),
        queryClient.invalidateQueries({ queryKey: ['positions'] }),
      ])

      toast.success('Close all limit orders created successfully!')
    } catch (error) {
      toast.error("Couldn't create a new order.", {
        description: error as string,
      })
    }
  }

  const handleRefreshPositions = () => {
    setValue('symbol', undefined)
    setValue('side', undefined)
    queryClient.invalidateQueries({ queryKey: ['positions'] })
  }

  const formRef = useRef<HTMLFormElement>(null)
  const [openSymbolFilter, setOpenSymbolFilter] = useState(false)
  const [openSideFilter, setOpenSideFilter] = useState(false)

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFilter)} ref={formRef}>
          <Label>Filters</Label>
          <div className="my-2 flex gap-2.5">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
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
                            ? openPositionsSymbols.find(
                                (symbol) => symbol === field.value,
                              )
                            : 'Select symbol'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="dark w-40 border-slate-800 bg-transparent p-0">
                      <Command>
                        {isPendingPositions ? (
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
                                {openPositionsSymbols?.map((symbol) => (
                                  <CommandItem
                                    value={symbol}
                                    key={symbol}
                                    onSelect={() => {
                                      form.setValue('symbol', symbol)

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

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-has-filter={!!form.getValues('symbol')}
                    className="invisible absolute -right-2 -top-4 size-6 rounded-full data-[has-filter=true]:visible"
                    onClick={() => {
                      form.setValue('symbol', undefined)

                      if (formRef && formRef.current) {
                        formRef.current.requestSubmit()
                      }
                    }}
                  >
                    <X className="size-4" />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
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
                                form.setValue('side', side)

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

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-has-filter={!!form.getValues('side')}
                    className="invisible absolute -right-2 -top-4 size-6 rounded-full data-[has-filter=true]:visible"
                    onClick={() => {
                      form.setValue('side', undefined)

                      if (formRef && formRef.current) {
                        formRef.current.requestSubmit()
                      }
                    }}
                  >
                    <X className="size-4" />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-1 justify-end pr-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleRefreshPositions}
              >
                <RefreshCcw
                  className={cn(
                    'size-4',
                    isFetchingPositions && 'animate-spin',
                  )}
                />
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
        {isPendingPositions ? (
          <div className="flex w-full items-center justify-center">
            <Spinner className="mt-32 size-10" />
          </div>
        ) : filteredPositions && filteredPositions.length > 0 ? (
          <Table className="relative rounded-2xl" hasWrapper={false}>
            <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-800 ">
              <TableRow>
                <TableHead className="w-56">Symbol</TableHead>
                <TableHead className="w-52">Side</TableHead>
                <TableHead className="w-72">Entry Price</TableHead>
                <TableHead className="w-56 text-right">Size</TableHead>
                <TableHead className="w-96 space-x-2 text-center">
                  <span>Close all:</span>
                  <Button
                    type="button"
                    variant="link"
                    disabled={isPendingNewOrder}
                    onClick={handleCloseAll}
                    className="h-4 px-0 dark:text-yellow-500 dark:hover:text-yellow-400"
                  >
                    {isPendingNewOrder ? <Spinner /> : <span>Market</span>}
                  </Button>

                  <Separator
                    orientation="vertical"
                    className="inline-block h-4 dark:bg-slate-700"
                  />

                  {isPendingSymbolsPrices ? (
                    <Spinner className="mb-1.5 inline-block size-3" />
                  ) : (
                    <CloseAllLimitPopover
                      symbolsInformation={filteredPositions.map((position) => {
                        const symbolData = symbols?.find(
                          (item) => item.symbol === position.symbol,
                        )

                        const symbolInformation: SymbolInformation = {
                          symbol: position.symbol,
                          quantity: roundToDecimals(
                            Math.abs(Number(position.positionAmt)),
                            symbolData ? symbolData.quantityPrecision : 2,
                          ),
                          quantityPrecision: symbolData
                            ? symbolData.quantityPrecision
                            : 2,
                          side: getPositionSide(Number(position.notional)),
                          price: prices[position.symbol] ?? 0.5,
                        }

                        return symbolInformation
                      })}
                      handleSubmit={handleCloseAllLimit}
                      isPending={isPendingNewOrder}
                    />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions
                .sort(
                  (positionA, positionB) =>
                    convertPriceToUsdt(
                      Number(positionB.positionAmt),
                      prices[positionB.symbol] ?? 0,
                    ) -
                    convertPriceToUsdt(
                      Number(positionA.positionAmt),
                      prices[positionA.symbol] ?? 0,
                    ),
                )
                .map((position, index) => {
                  const positionSide = getPositionSide(
                    Number(position.notional),
                  )
                  const symbolData = symbols?.find(
                    (item) => item.symbol === position.symbol,
                  )
                  return (
                    <TableRow key={index}>
                      <TableCell className="flex gap-1.5 font-medium">
                        <span>{position.symbol}</span>
                        <span className="rounded bg-stone-800 px-1 text-yellow-500">{`${position.leverage}x`}</span>
                      </TableCell>
                      <TableCell
                        data-long={positionSide === 'LONG'}
                        data-short={positionSide === 'SHORT'}
                        className="data-[long=true]:text-green-400 data-[short=true]:text-red-400"
                      >
                        {positionSide}
                      </TableCell>
                      <TableCell>
                        {Number(position.entryPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {`$ ${convertPriceToUsdt(
                          Number(position.positionAmt),
                          prices[position.symbol] ?? 0,
                        ).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 text-center">
                        <Button
                          type="button"
                          variant="link"
                          disabled={isPendingNewOrder}
                          onClick={() => {
                            handleCloseMarket(position)
                          }}
                          className="h-4 px-0 dark:text-yellow-500 dark:hover:text-yellow-400"
                        >
                          Market
                        </Button>

                        <Separator
                          orientation="vertical"
                          className="h-4 dark:bg-slate-700"
                        />

                        {symbolData && (
                          <CloseLimitPopover
                            quantity={roundToDecimals(
                              Math.abs(Number(position.positionAmt)),
                              symbolData.quantityPrecision,
                            )}
                            symbol={position.symbol}
                            handleSubmit={handleCloseLimit}
                            side={getPositionSide(Number(position.notional))}
                            isPending={isPendingNewOrder}
                            quantityPrecision={symbolData.quantityPrecision}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
            <TableFooter className="sticky -bottom-px z-10 translate-y-px dark:bg-slate-800">
              <TableRow>
                <TableCell colSpan={4}>Total (USDT)</TableCell>
                <TableCell className="text-right">
                  <span className="mr-1">$</span>
                  {isPendingSymbolsPrices
                    ? '...'
                    : filteredPositions
                        .reduce(
                          (total, position) =>
                            total +
                            convertPriceToUsdt(
                              Number(position.positionAmt),
                              prices[position.symbol] ?? 0,
                            ),
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
              There are no open positions or <br />
              no open positions matches your filters.
            </Label>
          </div>
        )}
      </ScrollArea>
    </>
  )
}
