import { SingleOrder } from '@/components/create-order/single-order'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CreateOrder() {
  return (
    <div className="m-auto flex flex-col justify-center gap-6">
      <Tabs
        defaultValue="single"
        className="flex w-[500px] flex-col items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="single">Positions</TabsTrigger>
          <TabsTrigger value="split">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <SingleOrder />
        </TabsContent>
        <TabsContent value="split">
          <div>Split</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
