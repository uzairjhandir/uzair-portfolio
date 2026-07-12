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

import { useDownloadListQuery } from "@/lib/query/downloads/queries";
import {
  useCreateDownloadMutation,
  useUpdateDownloadMutation,
  useDeleteDownloadMutation,
  useDuplicateDownloadMutation,
  DownloadPayload,
} from "@/lib/query/downloads/mutations";
import { DownloadItem, DownloadFilters } from "@/lib/query/downloads/types";
import { STATUS_LABELS, allowedNextStatuses } from "@/lib/query/downloads/workflow";

import { downloadColumns } from "./columns";
import { DownloadForm } from "./form";

type DialogMode = "create" | "edit" | "view" | "clone" | null;

export default function DownloadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("created_at:desc");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [sortBy, sortDir] = sort.split(":") as [DownloadFilters["sort_by"], DownloadFilters["sort_dir"]];

  const filters: DownloadFilters = {
    page,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isFetching } = useDownloadListQuery(filters);

  const createMutation = useCreateDownloadMutation();
  const updateMutation = useUpdateDownloadMutation();
  const deleteMutation = useDeleteDownloadMutation();
  const duplicateMutation = useDuplicateDownloadMutation();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [activeItem, setActiveItem] = useState<DownloadItem | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<DownloadItem | null>(null);

  const closeDialog = () => {
    setDialogMode(null);
    setActiveItem(undefined);
  };

  const handleSubmit = (payload: DownloadPayload) => {
    if (dialogMode === "edit" && activeItem) {
      updateMutation.mutate(
        { uuid: activeItem.uuid, data: payload },
        {
          onSuccess: () => {
            toast.success("Download updated");
            closeDialog();
          },
          onError: () => toast.error("Failed to update download"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Download created");
          closeDialog();
        },
        onError: () => toast.error("Failed to create download"),
      });
    }
  };

  const handleStatusTransition = (row: DownloadItem, next: DownloadItem["status"]) => {
    updateMutation.mutate(
      { uuid: row.uuid, data: { status: next } },
      {
        onSuccess: () => toast.success(`Moved to ${STATUS_LABELS[next]}`),
        onError: () => toast.error("Action failed"),
      }
    );
  };

  const columns: ColumnDef<DownloadItem>[] = [
    ...downloadColumns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {allowedNextStatuses(row.original.status).length > 0 && (
            <Select
              value=""
              onValueChange={(v) => handleStatusTransition(row.original, v as DownloadItem["status"])}
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
              setActiveItem(r);
              setDialogMode("edit");
            }}
            onClone={(r) => {
              duplicateMutation.mutate(r.uuid, {
                onSuccess: () => toast.success("Download duplicated"),
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
          <h1 className="text-2xl font-semibold">Downloads</h1>
          <p className="text-sm text-muted-foreground">Manage downloadable files, versions, and access rules.</p>
        </div>
        <Button
          onClick={() => {
            setActiveItem(undefined);
            setDialogMode("create");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Download
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
            <SelectItem value="download_count:desc">Most downloaded</SelectItem>
            <SelectItem value="updated_at:desc">Recently updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
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
        title="Download"
        mode={dialogMode ?? "create"}
      >
        <DownloadForm
          initialData={activeItem}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={dialogMode === "edit" ? "edit" : "create"}
        />
      </FormDialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete download?</DialogTitle>
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
                    toast.success("Download deleted");
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
