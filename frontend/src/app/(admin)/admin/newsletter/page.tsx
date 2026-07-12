"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscribersTab } from "./subscribers";
import { CampaignsTab } from "./campaigns";
import { ListsTab } from "./lists";

export default function NewsletterPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Newsletter</h1>
        <p className="text-sm text-muted-foreground">Manage subscribers, campaigns, and lists.</p>
      </div>

      <Tabs defaultValue="subscribers">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="lists">Lists</TabsTrigger>
        </TabsList>
        <TabsContent value="subscribers" className="pt-4">
          <SubscribersTab />
        </TabsContent>
        <TabsContent value="campaigns" className="pt-4">
          <CampaignsTab />
        </TabsContent>
        <TabsContent value="lists" className="pt-4">
          <ListsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
