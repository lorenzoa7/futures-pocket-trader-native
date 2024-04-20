import {
  CloseLimitQuantityPercentages,
  closeLimitQuantityPercentages,
} from '@/config/currency'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { stopPropagate } from '@/functions/stop-propagate'
import {
  CloseAllLimitSchema,
  closeAllLimitSchema,
} from '@/schemas/close-all-limit-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import Spinner from '../ui/spinner'

export type SymbolInformation = {
  quantity: number
  symbol: string
  side: 'LONG' | 'SHORT' | 'BOTH'
  price: number
  quantityPrecision: number
}

type Props = {
  symbolsInformation: SymbolInformation[]
  isPending: boolean
  handleSubmit: (data: CloseAllLimitSchema) => Promise<void>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CloseAllLimitPopover({
  symbolsInformation,
  isPending,
  handleSubmit,
  open,
  setOpen,
}: Props) {
  const [selectedPercentage, setSelectedPercentage] =
    useState<CloseLimitQuantityPercentages>(100)

  const form = useForm<CloseAllLimitSchema>({
    resolver: zodResolver(closeAllLimitSchema),
    defaultValues: {
      orders: symbolsInformation.map((data) => ({
        symbol: data.symbol,
        price: data.price,
        quantity: data.quantity,
        side: data.side === 'LONG' ? 'SELL' : 'BUY',
        isUsdtQuantity: false,
      })),
    },
  })

  const { setValue } = form

  useEffect(() => {
    setSelectedPercentage(100)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="link"
          disabled={isPending}
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
                Close all positions at limit price.
              </p>
            </div>

            <div className="flex items-center gap-1">
              {closeLimitQuantityPercentages.map((percentage) => (
                <Button
                  key={percentage}
                  type="button"
                  variant="outline"
                  size="sm"
                  data-selected={selectedPercentage === percentage}
                  className="w-12 px-2 text-sm dark:data-[selected=true]:bg-slate-800"
                  onClick={() => {
                    setSelectedPercentage(percentage)
                    symbolsInformation.forEach((symbolInformation, index) => {
                      setValue(
                        `orders.${index}.quantity`,
                        roundToDecimals(
                          symbolInformation.quantity * (percentage / 100),
                          symbolInformation.quantityPrecision,
                        ),
                      )
                    })
                  }}
                  disabled={isPending}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            <Button
              type="submit"
              className="flex w-32 items-center gap-2 border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-slate-50"
              variant="outline"
              disabled={isPending}
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
