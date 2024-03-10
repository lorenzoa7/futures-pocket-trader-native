import { stopPropagate } from '@/functions/stop-propagate'
import { usePositionsQuery } from '@/hooks/query/use-position-information-query'
import { useSetMarginTypeQuery } from '@/hooks/query/use-set-margin-type-query'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  MarginTypeSchema,
  marginTypeSchema,
} from '@/schemas/margin-type-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import Spinner from '../ui/spinner'

type Props = {
  symbol: string
}

export function MarginTypePopover({ symbol }: Props) {
  const [open, setOpen] = useState(false)
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: positions, isPending: isPendingPositions } = usePositionsQuery({
    onlyOpenPositions: false,
  })
  const { mutateAsync: setMarginType, isPending: isPendingSetMarginType } =
    useSetMarginTypeQuery()

  const queryClient = useQueryClient()

  const form = useForm<MarginTypeSchema>({
    resolver: zodResolver(marginTypeSchema),
    defaultValues: {
      symbol,
      marginType: 'CROSSED',
    },
  })

  const { setValue } = form

  async function handleSetMarginType(data: MarginTypeSchema) {
    await setMarginType({
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
      setValue(
        'marginType',
        position.marginType === 'isolated' ? 'ISOLATED' : 'CROSSED',
      )
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={isPendingPositions}>
          {isPendingPositions || !positions ? (
            <Spinner className="fill-white text-slate-800" />
          ) : (
            `${positions.find((position) => position.symbol === symbol)?.marginType === 'isolated' ? 'Isolated' : 'Cross'}`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-slate-800 bg-slate-950 text-slate-50">
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSetMarginType))}
            className="space-y-5"
          >
            <div className="mb-5 space-y-2">
              <h4 className="font-medium leading-none">Adjust margin type</h4>
              <p className="text-muted-foreground text-sm">
                Set the margin type for {symbol}.
              </p>
            </div>
            <FormField
              control={form.control}
              name="marginType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem label="Isolated" value="ISOLATED" />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem label="Cross" value="CROSSED" />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-32 items-center gap-2 border-slate-800 bg-slate-950 hover:bg-slate-800 hover:text-slate-50"
              variant="outline"
              disabled={isPendingSetMarginType || isPendingPositions}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {(isPendingSetMarginType || isPendingPositions) && (
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
