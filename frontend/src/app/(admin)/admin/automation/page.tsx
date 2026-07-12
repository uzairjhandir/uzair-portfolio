"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Loader2, Trash2, Pencil, GitBranch, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/ui/tables/DataTable";
import { useWorkflowListQuery, useWorkflowVersionsQuery, useWorkflowRunsQuery } from "@/lib/query/automation/queries";
import {
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  usePublishVersionMutation,
  WorkflowPayload,
} from "@/lib/query/automation/mutations";
import { Workflow } from "@/lib/query/automation/types";

export default function AutomationPage() {
  const { data, isLoading, isFetching } = useWorkflowListQuery();
  const createMutation = useCreateWorkflowMutation();
  const updateMutation = useUpdateWorkflowMutation();
  const deleteMutation = useDeleteWorkflowMutation();
  const publishMutation = usePublishVersionMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Workflow | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const [inspecting, setInspecting] = useState<Workflow | null>(null);
  const [definitionJson, setDefinitionJson] = useState('{\n  "start_node": "n1",\n  "nodes": {},\n  "edges": []\n}');

  const { data: versions } = useWorkflowVersionsQuery(inspecting?.uuid ?? "");
  const { data: runs } = useWorkflowRunsQuery(inspecting?.uuid ?? "");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setIsActive(false);
    setDialogOpen(true);
  };

  const openEdit = (w: Workflow) => {
    setEditing(w);
    setName(w.name);
    setDescription(w.description || "");
    setIsActive(w.is_active);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WorkflowPayload = { name, description, is_active: isActive };
    if (editing) {
      updateMutation.mutate(
        { uuid: editing.uuid, data: payload },
        {
          onSuccess: () => { toast.success("Workflow updated"); setDialogOpen(false); },
          onError: () => toast.error("Failed to update workflow"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success("Workflow created"); setDialogOpen(false); },
        onError: () => toast.error("Failed to create workflow"),
      });
    }
  };

  const handlePublish = () => {
    if (!inspecting) return;
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(definitionJson);
    } catch {
      toast.error("Invalid JSON definition");
      return;
    }
    publishMutation.mutate(
      { uuid: inspecting.uuid, definition: parsed },
      {
        onSuccess: () => toast.success("Version published"),
        onError: () => toast.error("Failed to publish version"),
      }
    );
  };

  const columns: ColumnDef<Workflow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "outline"}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "latest_version",
      header: "Version",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.latest_version ? `v${row.original.latest_version.version}` : "No version published"}
        </span>
      ),
    },
    {
      accessorKey: "runs_count",
      header: "Runs",
      cell: ({ row }) => <span className="text-sm">{row.original.runs_count}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="sm" onClick={() => { setInspecting(row.original); }}>
            <GitBranch className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Automation</h1>
          <p className="text-sm text-muted-foreground">Manage workflow definitions and monitor run history. Reuses the existing WorkflowEngine — no new automation engine was built.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} isLoading={isLoading || isFetching} totalCount={data?.total} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Workflow" : "New Workflow"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(!!v)} id="is_active" />
              <Label htmlFor="is_active" className="!mb-0">Active</Label>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!inspecting} onOpenChange={(open) => !open && setInspecting(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{inspecting?.name} — Versions &amp; Runs</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Publish New Version (JSON graph definition)</Label>
              <Textarea value={definitionJson} onChange={(e) => setDefinitionJson(e.target.value)} rows={6} className="font-mono text-xs" />
              <Button size="sm" onClick={handlePublish} disabled={publishMutation.isPending}>
                {publishMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Publish Version
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Version History</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {versions?.length ? versions.map((v) => (
                  <div key={v.id} className="text-sm border rounded px-3 py-2 flex justify-between">
                    <span>v{v.version}</span>
                    <span className="text-muted-foreground">{new Date(v.published_at).toLocaleString()}</span>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No versions published yet.</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Run History</Label>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {runs?.data.length ? runs.data.map((r) => (
                  <div key={r.id} className="text-sm border rounded px-3 py-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><PlayCircle className="w-3.5 h-3.5" /> Run #{r.id}</span>
                    <Badge variant="outline" className="capitalize">{r.status}</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No runs yet — this workflow has never been triggered.</p>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workflow &quot;{deleteTarget?.name}&quot;?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.uuid, {
                  onSuccess: () => { toast.success("Workflow deleted"); setDeleteTarget(null); },
                  onError: () => toast.error("Delete failed"),
                });
              }}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
