import { Positions } from '@/components/information/positions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Information() {
  return (
    <div className="m-auto flex flex-col justify-center gap-6">
      <Tabs
        defaultValue="positions"
        className="flex w-[400px] flex-col items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="Orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="positions">
          <Positions />
        </TabsContent>
        <TabsContent value="Orders">Here you can see your orders.</TabsContent>
      </Tabs>
    </div>
  )
}
