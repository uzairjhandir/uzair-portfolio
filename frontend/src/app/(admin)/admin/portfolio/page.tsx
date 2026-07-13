"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/admin/ui/tables/DataTable";
import { DataTableRowActions } from "@/components/admin/ui/tables/DataTableRowActions";
import { FormDialog } from "@/components/admin/ui/forms/FormDialog";

import { usePortfolioListQuery } from "@/lib/query/portfolio/queries";
import {
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useDuplicatePortfolioMutation,
  PortfolioPayload,
} from "@/lib/query/portfolio/mutations";
import { PortfolioProject, PortfolioFilters } from "@/lib/query/portfolio/types";
import { STATUS_LABELS, allowedNextStatuses } from "@/lib/query/portfolio/workflow";

import { portfolioColumns } from "./columns";
import { PortfolioForm } from "./form";

type DialogMode = "create" | "edit" | "view" | "clone" | null;

export default function PortfolioPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("created_at:desc");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [sortBy, sortDir] = sort.split(":") as [PortfolioFilters["sort_by"], PortfolioFilters["sort_dir"]];

  const filters: PortfolioFilters = {
    page,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isFetching, isError, error, refetch } = usePortfolioListQuery(filters);

  const createMutation = useCreatePortfolioMutation();
  const updateMutation = useUpdatePortfolioMutation();
  const deleteMutation = useDeletePortfolioMutation();
  const duplicateMutation = useDuplicatePortfolioMutation();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [activeProject, setActiveProject] = useState<PortfolioProject | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioProject | null>(null);

  const closeDialog = () => {
    setDialogMode(null);
    setActiveProject(undefined);
  };

  const handleSubmit = (payload: PortfolioPayload) => {
    if (dialogMode === "edit" && activeProject) {
      updateMutation.mutate(
        { uuid: activeProject.uuid, data: payload },
        {
          onSuccess: () => {
            toast.success("Portfolio project updated");
            closeDialog();
          },
          onError: () => toast.error("Failed to update project"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Portfolio project created");
          closeDialog();
        },
        onError: () => toast.error("Failed to create project"),
      });
    }
  };

  const handleStatusTransition = (row: PortfolioProject, next: PortfolioProject["status"]) => {
    updateMutation.mutate(
      { uuid: row.uuid, data: { status: next } },
      {
        onSuccess: () => toast.success(`Moved to ${STATUS_LABELS[next]}`),
        onError: () => toast.error("Action failed"),
      }
    );
  };

  const columns: ColumnDef<PortfolioProject>[] = [
    ...portfolioColumns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {allowedNextStatuses(row.original.status).length > 0 && (
            <Select
              value=""
              onValueChange={(v) => handleStatusTransition(row.original, v as PortfolioProject["status"])}
              disabled={updateMutation.isPending}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue placeholder="Move to..." />
              </SelectTrigger>
              <SelectContent>
                {allowedNextStatuses(row.original.status).map((next) => (
                  <SelectItem key={next} value={next}>{STATUS_LABELS[next]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DataTableRowActions
            row={row.original}
            onEdit={(r) => {
              setActiveProject(r);
              setDialogMode("edit");
            }}
            onClone={(r) => {
              duplicateMutation.mutate(r.uuid, {
                onSuccess: () => toast.success("Portfolio project duplicated"),
                onError: () => toast.error("Duplicate failed"),
              });
            }}
            onDelete={(r) => setDeleteTarget(r)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Portfolio Projects</h1>
          <p className="text-sm text-muted-foreground">Manage portfolio content, gallery, technologies and SEO.</p>
        </div>
        <Button
          onClick={() => {
            setActiveProject(undefined);
            setDialogMode("create");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at:desc">Newest first</SelectItem>
            <SelectItem value="created_at:asc">Oldest first</SelectItem>
            <SelectItem value="title:asc">Title A–Z</SelectItem>
            <SelectItem value="title:desc">Title Z–A</SelectItem>
            <SelectItem value="completion_date:desc">Completion date (newest)</SelectItem>
            <SelectItem value="completion_date:asc">Completion date (oldest)</SelectItem>
            <SelectItem value="updated_at:desc">Recently updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
        isError={isError}
        error={error}
        onRefresh={refetch}
        searchQuery={search}
        setSearchQuery={(v) => { setSearch(v); setPage(1); }}
        totalCount={data?.meta?.total}
        manualPagination
        pageCount={data?.meta?.last_page ?? 1}
        pagination={{ pageIndex: page - 1, pageSize: perPage }}
        onPaginationChange={(updater) => {
          const current = { pageIndex: page - 1, pageSize: perPage };
          const next = typeof updater === "function" ? updater(current) : updater;
          setPage(next.pageIndex + 1);
        }}
      />

      <FormDialog
        open={dialogMode !== null}
        onOpenChange={(open) => !open && closeDialog()}
        title="Portfolio Project"
        mode={dialogMode ?? "create"}
      >
        <PortfolioForm
          initialData={activeProject}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={dialogMode === "edit" ? "edit" : "create"}
        />
      </FormDialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete portfolio project?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{deleteTarget?.title}&quot;. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.uuid, {
                  onSuccess: () => {
                    toast.success("Portfolio project deleted");
                    setDeleteTarget(null);
                  },
                  onError: () => toast.error("Delete failed"),
                });
              }}
              disabled={deleteMutation.isPending}
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
