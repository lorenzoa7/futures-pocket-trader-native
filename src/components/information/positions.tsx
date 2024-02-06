import { usePositionsQuery } from '@/hooks/query/use-position-information-query'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
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
  const { data: positions } = usePositionsQuery()
  return (
    <ScrollArea className="flex h-72 w-full flex-col gap-3 pr-3">
      {positions ? (
        <Table className="relative" hasWrapper={false}>
          <TableHeader className="sticky top-0 z-10 w-full bg-slate-800">
            <TableRow>
              <TableHead className="w-48">Symbol</TableHead>
              <TableHead className="w-48">Side</TableHead>
              <TableHead className="w-48">Entry Price</TableHead>
              <TableHead className="w-48 text-right">Size</TableHead>
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
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                <span className="mr-1">$</span>
                {positions
                  .reduce(
                    (total, position) => total + Number(position.positionAmt),
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
