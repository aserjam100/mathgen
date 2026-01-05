import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExampleInput } from '@/components/ExampleInput';
import { ExampleList } from '@/components/ExampleList';

export function ExampleManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExampleSaved = () => {
    // Trigger a refresh of the ExampleList by updating the trigger
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Examples</TabsTrigger>
          <TabsTrigger value="manage">View & Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <ExampleInput onExampleSaved={handleExampleSaved} />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ExampleList refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
