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

import { useBlogListQuery } from "@/lib/query/blog/queries";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useDuplicateBlogMutation,
  BlogPayload,
} from "@/lib/query/blog/mutations";
import { BlogPost, BlogFilters } from "@/lib/query/blog/types";
import { STATUS_LABELS, allowedNextStatuses } from "@/lib/query/blog/workflow";

import { blogColumns } from "./columns";
import { BlogForm } from "./form";

type DialogMode = "create" | "edit" | "view" | "clone" | null;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("created_at:desc");
  const [page, setPage] = useState(1);
  const perPage = 15;

  const [sortBy, sortDir] = sort.split(":") as [BlogFilters["sort_by"], BlogFilters["sort_dir"]];

  const filters: BlogFilters = {
    page,
    per_page: perPage,
    sort_by: sortBy,
    sort_dir: sortDir,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isFetching } = useBlogListQuery(filters);

  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  const deleteMutation = useDeleteBlogMutation();
  const duplicateMutation = useDuplicateBlogMutation();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [activePost, setActivePost] = useState<BlogPost | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const closeDialog = () => {
    setDialogMode(null);
    setActivePost(undefined);
  };

  const handleSubmit = (payload: BlogPayload) => {
    if (dialogMode === "edit" && activePost) {
      updateMutation.mutate(
        { uuid: activePost.uuid, data: payload },
        {
          onSuccess: () => {
            toast.success("Blog post updated");
            closeDialog();
          },
          onError: () => toast.error("Failed to update blog post"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Blog post created");
          closeDialog();
        },
        onError: () => toast.error("Failed to create blog post"),
      });
    }
  };

  const handleStatusTransition = (row: BlogPost, next: BlogPost["status"]) => {
    updateMutation.mutate(
      { uuid: row.uuid, data: { status: next } },
      {
        onSuccess: () => toast.success(`Moved to ${STATUS_LABELS[next]}`),
        onError: () => toast.error("Action failed"),
      }
    );
  };

  const columns: ColumnDef<BlogPost>[] = [
    ...blogColumns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {allowedNextStatuses(row.original.status).length > 0 && (
            <Select
              value=""
              onValueChange={(v) => handleStatusTransition(row.original, v as BlogPost["status"])}
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
              setActivePost(r);
              setDialogMode("edit");
            }}
            onClone={(r) => {
              duplicateMutation.mutate(r.uuid, {
                onSuccess: () => toast.success("Blog post duplicated"),
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
          <h1 className="text-2xl font-semibold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Manage blog content, categories, tags and SEO.</p>
        </div>
        <Button
          onClick={() => {
            setActivePost(undefined);
            setDialogMode("create");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
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
            <SelectItem value="publish_at:desc">Publish date (newest)</SelectItem>
            <SelectItem value="publish_at:asc">Publish date (oldest)</SelectItem>
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
        title="Blog Post"
        mode={dialogMode ?? "create"}
      >
        <BlogForm
          initialData={activePost}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={dialogMode === "edit" ? "edit" : "create"}
        />
      </FormDialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete blog post?</DialogTitle>
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
                    toast.success("Blog post deleted");
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
