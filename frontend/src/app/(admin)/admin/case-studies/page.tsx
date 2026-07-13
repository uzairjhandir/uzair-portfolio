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

import { useCaseStudyListQuery } from "@/lib/query/case-studies/queries";
import {
  useCreateCaseStudyMutation,
  useUpdateCaseStudyMutation,
  useDeleteCaseStudyMutation,
  useDuplicateCaseStudyMutation,
  CaseStudyPayload,
} from "@/lib/query/case-studies/mutations";
import { CaseStudy, CaseStudyFilters } from "@/lib/query/case-studies/types";
import { STATUS_LABELS, allowedNextStatuses } from "@/lib/query/case-studies/workflow";

import { caseStudiesColumns } from "./columns";
import { CaseStudyForm } from "./form";

type DialogMode = "create" | "edit" | "view" | "clone" | null;

export default function CaseStudiesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("created_at:desc");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [sortBy, sortDir] = sort.split(":") as [CaseStudyFilters["sort_by"], CaseStudyFilters["sort_dir"]];

  const filters: CaseStudyFilters = {
    page,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useCaseStudyListQuery(filters);

  const createMutation = useCreateCaseStudyMutation();
  const updateMutation = useUpdateCaseStudyMutation();
  const deleteMutation = useDeleteCaseStudyMutation();
  const duplicateMutation = useDuplicateCaseStudyMutation();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [activeItem, setActiveItem] = useState<CaseStudy | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);

  const closeDialog = () => {
    setDialogMode(null);
    setActiveItem(undefined);
  };

  const handleSubmit = (payload: CaseStudyPayload) => {
    if (dialogMode === "edit" && activeItem) {
      updateMutation.mutate(
        { uuid: activeItem.uuid, data: payload },
        {
          onSuccess: () => {
            toast.success("Case study updated");
            closeDialog();
          },
          onError: () => toast.error("Failed to update case study"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Case study created");
          closeDialog();
        },
        onError: () => toast.error("Failed to create case study"),
      });
    }
  };

  const handleStatusTransition = (row: CaseStudy, next: CaseStudy["status"]) => {
    updateMutation.mutate(
      { uuid: row.uuid, data: { status: next } },
      {
        onSuccess: () => toast.success(`Moved to ${STATUS_LABELS[next]}`),
        onError: () => toast.error("Action failed"),
      }
    );
  };

  const columns: ColumnDef<CaseStudy>[] = [
    ...caseStudiesColumns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {allowedNextStatuses(row.original.status).length > 0 && (
            <Select
              value=""
              onValueChange={(v) => handleStatusTransition(row.original, v as CaseStudy["status"])}
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
                onSuccess: () => toast.success("Case study duplicated"),
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
          <h1 className="text-2xl font-semibold">Case Studies</h1>
          <p className="text-sm text-muted-foreground">Manage case study narratives, metrics, and related portfolio projects.</p>
        </div>
        <Button
          onClick={() => {
            setActiveItem(undefined);
            setDialogMode("create");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Case Study
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
        title="Case Study"
        mode={dialogMode ?? "create"}
      >
        <CaseStudyForm
          initialData={activeItem}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={dialogMode === "edit" ? "edit" : "create"}
        />
      </FormDialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete case study?</DialogTitle>
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
                    toast.success("Case study deleted");
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
