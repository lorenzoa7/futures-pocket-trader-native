import { SingleOrder } from '@/components/create-order/single-order'
import { SplitOrder } from '@/components/create-order/split-order'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CreateOrder() {
  return (
    <div className="m-auto flex flex-col justify-center gap-6">
      <Tabs
        defaultValue="single"
        className="flex w-[500px] flex-col items-center justify-center"
      >
        <TabsList>
          <TabsTrigger value="single">Single</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <SingleOrder />
        </TabsContent>
        <TabsContent value="split">
          <SplitOrder />
        </TabsContent>
      </Tabs>
    </div>
  )
}
