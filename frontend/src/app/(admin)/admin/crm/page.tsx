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

import { useContactListQuery } from "@/lib/query/crm/queries";
import { useCreateContactMutation, useDeleteContactMutation, ContactCreatePayload } from "@/lib/query/crm/mutations";
import { CrmContact, CrmContactFilters } from "@/lib/query/crm/types";

import { crmColumns } from "./columns";
import { ContactCreateForm } from "./form";
import { ContactDetail } from "./detail";

const STATUS_OPTIONS = ["new", "contacted", "qualified", "customer", "archived"];

export default function CrmPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filters: CrmContactFilters = {
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isFetching } = useContactListQuery(filters);

  const createMutation = useCreateContactMutation();
  const deleteMutation = useDeleteContactMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<CrmContact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CrmContact | null>(null);

  const handleCreate = (payload: ContactCreatePayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Contact created");
        setCreateOpen(false);
      },
      onError: () => toast.error("Failed to create contact"),
    });
  };

  const columns: ColumnDef<CrmContact>[] = [
    ...crmColumns,
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row.original}
          onView={(r) => setActiveContact(r)}
          onEdit={(r) => setActiveContact(r)}
          onDelete={(r) => setDeleteTarget(r)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CRM — Leads &amp; Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage inbound leads, status, assignment, and activity history.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
        searchQuery={search}
        setSearchQuery={setSearch}
        totalCount={data?.meta?.total}
      />

      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Contact"
        mode="create"
      >
        <ContactCreateForm onSubmit={handleCreate} isSubmitting={createMutation.isPending} />
      </FormDialog>

      <Dialog open={!!activeContact} onOpenChange={(open) => !open && setActiveContact(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeContact?.full_name}</DialogTitle>
          </DialogHeader>
          {activeContact && <ContactDetail contact={activeContact} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive contact?</DialogTitle>
            <DialogDescription>
              This will archive &quot;{deleteTarget?.full_name}&quot;. This can be reversed by an administrator via the database if needed.
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
                    toast.success("Contact archived");
                    setDeleteTarget(null);
                  },
                  onError: () => toast.error("Delete failed"),
                });
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
