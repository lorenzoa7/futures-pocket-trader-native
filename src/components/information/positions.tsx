import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { usePositionsQuery } from '@/hooks/query/use-position-information-query'
import { useSymbolsPriceQueries } from '@/hooks/query/use-symbols-price-queries'
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

export function Positions() {
  const { data: positions, isPending: isPendingPositions } = usePositionsQuery()
  const { data: prices, isPending: isPendingSymbolsPrices } =
    useSymbolsPriceQueries(
      positions
        ? [...new Set(positions.map((position) => position.symbol))]
        : [],
    )

  return (
    <ScrollArea className="flex h-72 w-full flex-col gap-3 pr-3">
      {isPendingPositions ? (
        <Spinner className="mt-32 size-10" />
      ) : positions && positions?.length > 0 ? (
        <Table className="relative rounded-2xl" hasWrapper={false}>
          <TableHeader className="sticky top-0 z-10 w-full bg-slate-800">
            <TableRow>
              <TableHead className="w-48 rounded-tl-lg">Symbol</TableHead>
              <TableHead className="w-48">Side</TableHead>
              <TableHead className="w-48">Entry Price</TableHead>
              <TableHead className="w-48 rounded-tr-lg text-right">
                Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{position.symbol}</TableCell>
                <TableCell>{position.positionSide}</TableCell>
                <TableCell>{Number(position.entryPrice).toFixed(3)}</TableCell>
                <TableCell className="text-right">
                  {Number(position.positionAmt).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="sticky bottom-0 z-10 dark:bg-slate-800">
            <TableRow>
              <TableCell colSpan={3} className="rounded-bl-lg">
                Total (USDT)
              </TableCell>
              <TableCell className="rounded-br-lg text-right">
                <span className="mr-1">$</span>
                {isPendingSymbolsPrices
                  ? '...'
                  : positions
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
        <Label>There's no open positions.</Label>
      )}
    </ScrollArea>
  )
}
