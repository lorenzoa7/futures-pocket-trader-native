import { getOrderSide } from '@/functions/get-order-side'
import { useOpenOrdersQuery } from '@/hooks/query/use-open-orders-query'
import { Label } from '../ui/label'
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

  return (
    <ScrollArea className="flex h-72 w-full flex-col gap-3 pr-3">
      {isPendingOrders ? (
        <Spinner className="mt-32 size-10" />
      ) : orders && orders?.length > 0 ? (
        <Table className="relative rounded-2xl" hasWrapper={false}>
          <TableHeader className="sticky top-0 z-10 w-full bg-slate-800">
            <TableRow>
              <TableHead className="w-52 rounded-tl-lg">Symbol</TableHead>
              <TableHead className="w-52">Side</TableHead>
              <TableHead className="w-52">Quantity</TableHead>
              <TableHead className="w-52 rounded-tr-lg text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              const orderSide = getOrderSide(order.side)
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell
                    data-long={orderSide === 'LONG'}
                    data-short={orderSide === 'SHORT'}
                    className="data-[long=true]:text-green-400 data-[short=true]:text-red-400"
                  >
                    {orderSide}
                  </TableCell>
                  <TableCell>{Number(order.origQty)}</TableCell>
                  <TableCell className="text-right">
                    {Number(order.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter className="sticky bottom-0 z-10 dark:bg-slate-800">
            <TableRow>
              <TableCell colSpan={3} className="rounded-bl-lg">
                Total (USDT)
              </TableCell>
              <TableCell className="rounded-br-lg text-right">
                <span className="mr-1">$</span>
                {orders
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
        <Label>There's no open orders.</Label>
      )}
    </ScrollArea>
  )
}
