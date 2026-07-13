"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettingsQuery } from "@/lib/query/settings/queries";
import { CategorySettingsForm } from "./CategorySettingsForm";
import { SmtpTestPanel } from "./SmtpTestPanel";
import { LoadingState } from "@/components/admin/ui/states/LoadingState";
import { ErrorState } from "@/components/admin/ui/states/ErrorState";
import { EmptyState } from "@/components/admin/ui/states/EmptyState";
import { getErrorMessage } from "@/lib/utils";

// Preferred display order; any other categories the backend returns still
// render (sorted by their own sort_order), just after these.
const PRIORITY_ORDER = ["general", "seo", "social", "email", "livechat", "analytics", "security", "api"];

export default function SettingsPage() {
  const { data: categories, isLoading, isError, error, refetch } = useSettingsQuery();

  if (isLoading) {
    return <LoadingState message="Loading settings..." />;
  }

  if (isError || !categories) {
    return <ErrorState message={getErrorMessage(error, "Failed to load settings.")} onRetry={refetch} />;
  }

  const slugs = Object.keys(categories).sort((a, b) => {
    const ai = PRIORITY_ORDER.indexOf(a);
    const bi = PRIORITY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return categories[a].sort_order - categories[b].sort_order;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  if (slugs.length === 0) {
    return <EmptyState title="No settings categories found" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Site configuration, SEO, email, live chat, analytics, and API credentials.
        </p>
      </div>

      <Tabs defaultValue={slugs[0]}>
        <TabsList className="flex-wrap h-auto">
          {slugs.map((slug) => (
            <TabsTrigger key={slug} value={slug}>
              {categories[slug].name}
            </TabsTrigger>
          ))}
        </TabsList>

        {slugs.map((slug) => (
          <TabsContent key={slug} value={slug}>
            <Card>
              <CardHeader>
                <CardTitle>{categories[slug].name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CategorySettingsForm
                  category={categories[slug]}
                  extra={slug === "email" ? <SmtpTestPanel /> : undefined}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
