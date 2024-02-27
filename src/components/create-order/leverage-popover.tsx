import { stopPropagate } from '@/functions/stop-propagate'
import { usePositionsQuery } from '@/hooks/query/use-position-information-query'
import { useSetLeverageQuery } from '@/hooks/query/use-set-leverage-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { LeverageSchema, leverageSchema } from '@/schemas/leverage-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Slider } from '../ui/slider'
import Spinner from '../ui/spinner'

type Props = {
  symbol: string
}

export function LeveragePopover({ symbol }: Props) {
  const [open, setOpen] = useState(false)
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: positions, isPending: isPendingPositions } = usePositionsQuery({
    onlyOpenPositions: false,
  })
  const { mutateAsync: setLeverage, isPending: isPendingSetLeverage } =
    useSetLeverageQuery()

  const queryClient = useQueryClient()

  const form = useForm<LeverageSchema>({
    resolver: zodResolver(leverageSchema),
    defaultValues: {
      symbol,
      leverage: 20,
    },
  })

  const setValue = form.setValue

  async function handleSetLeverage(data: LeverageSchema) {
    await setLeverage({
      apiKey,
      secretKey,
      isTestnetAccount,
      data,
    })

    await queryClient.invalidateQueries({ queryKey: ['positions'] })
  }

  useEffect(() => {
    const position = positions?.find((position) => position.symbol === symbol)

    if (position) {
      setValue('leverage', Number(position.leverage))
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={isPendingPositions}>
          {isPendingPositions || !positions ? (
            <Spinner className="fill-white text-slate-800" />
          ) : (
            `${positions.find((position) => position.symbol === symbol)?.leverage}x`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-slate-800 bg-slate-950 text-slate-50">
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSetLeverage))}
            className="space-y-5"
          >
            <div className="mb-5 space-y-2">
              <h4 className="font-medium leading-none">Adjust leverage</h4>
              <p className="text-muted-foreground text-sm">
                Set the leverage for {symbol}.
              </p>
            </div>
            <FormField
              control={form.control}
              name="leverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leverage - {field.value}x</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={125}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => {
                        field.onChange(vals[0])
                      }}
                      className="dark"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-32 items-center gap-2 border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-slate-50"
              variant="outline"
              disabled={isPendingSetLeverage || isPendingPositions}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {(isPendingSetLeverage || isPendingPositions) && (
                <Spinner className="fill-white text-slate-800" />
              )}
              Confirm
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
