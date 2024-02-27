import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { getOrderSide } from '@/functions/get-order-side'
import { useSplitOrdersQuery } from '@/hooks/query/use-split-orders-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { SplitOrderSchema } from '@/schemas/split-order-schema'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
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

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setPrices: React.Dispatch<React.SetStateAction<number[]>>
  setData: React.Dispatch<React.SetStateAction<SplitOrderSchema | undefined>>
  prices: number[]
  data?: SplitOrderSchema
}

export function ConfirmSplitOrderDialog({
  open,
  setOpen,
  setData,
  setPrices,
  data,
  prices,
}: Props) {
  const orderSide = getOrderSide(data ? data.side : 'BUY')
  const { mutateAsync: splitOrders, isPending } = useSplitOrdersQuery()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const queryClient = useQueryClient()

  const handleConfirmSplitOrder = async () => {
    if (data) {
      await splitOrders({ apiKey, secretKey, isTestnetAccount, data, prices })

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['open-orders'],
        }),
        queryClient.invalidateQueries({ queryKey: ['positions'] }),
      ])

      setPrices([])
      setData(undefined)
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!data && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-50">
              Confirm split order
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {`You are going to create ${data.ordersQuantity} ${data.symbol} orders.`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
            <Table className="relative rounded-2xl" hasWrapper={false}>
              <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-800 ">
                <TableRow className="hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                  <TableHead className="w-52 text-slate-300">Symbol</TableHead>
                  <TableHead className="w-52 text-slate-300">Side</TableHead>
                  <TableHead className="w-52 text-slate-300">
                    Entry Price
                  </TableHead>
                  <TableHead className="w-52 text-right text-slate-300">
                    Size
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((price, index) => (
                  <TableRow
                    key={index}
                    className="text-slate-50 hover:bg-slate-800/50 data-[state=selected]:bg-slate-800"
                  >
                    <TableCell className="font-medium">{data.symbol}</TableCell>
                    <TableCell
                      data-long={orderSide === 'LONG'}
                      data-short={orderSide === 'SHORT'}
                      className="data-[long=true]:text-green-400 data-[short=true]:text-red-400"
                    >
                      {orderSide}
                    </TableCell>
                    <TableCell>{price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {`$ ${convertPriceToUsdt(data.size, price).toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="sticky -bottom-px z-10 bg-slate-800">
                <TableRow className="hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                  <TableCell colSpan={3} className="text-slate-300">
                    Total (USDT)
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    <span className="mr-1">$</span>
                    {prices
                      .reduce(
                        (total, price) =>
                          total + convertPriceToUsdt(data.size, price),
                        0,
                      )
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>

          <DialogFooter className="pr-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-slate-800 bg-slate-950 text-slate-50 hover:bg-slate-800 hover:text-slate-50"
              >
                Close
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="secondary"
              className="flex gap-2 bg-slate-800 text-slate-50 hover:bg-slate-800/80"
              disabled={isPending}
              onClick={handleConfirmSplitOrder}
            >
              {isPending && (
                <Spinner className="size-4 fill-white text-slate-800" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
