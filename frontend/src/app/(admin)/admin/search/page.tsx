"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, Trash2, Database, Clock, AlertTriangle, Layers } from "lucide-react";
import { useSearchHealthQuery, useRebuildSearchIndexMutation, useFlushSearchIndexMutation } from "@/lib/query/search-admin/queries";

export default function SearchAdminPage() {
  const { data: health, isLoading, isError } = useSearchHealthQuery();
  const rebuild = useRebuildSearchIndexMutation();
  const flush = useFlushSearchIndexMutation();

  const handleRebuild = () => {
    rebuild.mutate(undefined, {
      onSuccess: () => toast.success("Search index rebuild queued."),
      onError: () => toast.error("Failed to queue rebuild."),
    });
  };

  const handleFlush = () => {
    if (!confirm("Flush the entire search index? This removes all indexed documents until the next rebuild.")) return;
    flush.mutate(undefined, {
      onSuccess: () => toast.success("Search index flushed."),
      onError: () => toast.error("Failed to flush index."),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
          <p className="text-muted-foreground text-sm mt-2">Index health, rebuild, and maintenance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleFlush} disabled={flush.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            {flush.isPending ? "Flushing..." : "Flush Index"}
          </Button>
          <Button onClick={handleRebuild} disabled={rebuild.isPending}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {rebuild.isPending ? "Queuing..." : "Rebuild Index"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading search health...</p>
      ) : isError || !health ? (
        <p className="text-red-500 text-sm">Failed to load search health.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indexed Records</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.indexed_documents}</div>
              <p className="text-xs text-muted-foreground mt-1">Driver: {health.driver}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Indexed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {health.last_successful_index ? new Date(health.last_successful_index).toLocaleString() : "Never"}
              </div>
              {health.last_rebuild && (
                <p className="text-xs text-muted-foreground mt-1">Last rebuild: {new Date(health.last_rebuild).toLocaleString()}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Backlog</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.queue_backlog}</div>
              <p className="text-xs text-muted-foreground mt-1">Pending: {health.pending_documents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Documents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{health.failed_documents}</div>
              <p className="text-xs text-muted-foreground mt-1">Avg query: {health.average_query_time_ms}ms</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(health.capabilities).map(([key, enabled]) => (
                <Badge key={key} variant={enabled ? "default" : "outline"} className="capitalize">
                  {key.replace(/_/g, " ")}: {enabled ? "on" : "off"}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
