import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useGenericCrud } from "@/lib/hooks/crud/useGenericCrud"
import { DataTable } from "../tables/DataTable"
import { FormDialog } from "../forms/FormDialog"
import { ConfirmDialog } from "../forms/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { usePermissions } from "@/lib/hooks/auth/usePermissions"

export interface CrudPermissions {
  view?: string
  create?: string
  edit?: string
  delete?: string
  publish?: string
  restore?: string
  export?: string
}

import { ResourceKey } from "@/lib/api/resources"

export interface CrudConfig<TData> {
  resource: ResourceKey
  queryKey: readonly unknown[]
  columns: ColumnDef<TData, unknown>[]
  title: string
  FormComponent: React.ComponentType<{ 
    initialData?: TData; 
    onSubmit: (data: Partial<TData>) => void;
    isSubmitting: boolean;
    mode: "create" | "edit" | "view" | "clone"
  }>
  permissions?: CrudPermissions
  defaultSort?: { field: string; dir: "asc" | "desc" }
  defaultFilters?: Record<string, unknown>
  searchFields?: string[]
  bulkActions?: React.ReactNode
  toolbar?: React.ReactNode
}

export function createCrud<TData extends { id: string | number }>(config: CrudConfig<TData>) {
  return function CrudInstance() {
    const { 
      data, 
      isLoading, 
      filters, 
      updateFilter, 
      create, 
      update, 
      deleteRecord, 
      refetch,
      meta
    } = useGenericCrud<TData>({
      resourceKey: config.resource,
      queryKey: config.queryKey,
      initialFilters: {
        ...config.defaultFilters,
        sort_by: config.defaultSort?.field,
        sort_dir: config.defaultSort?.dir,
      }
    })

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [formMode, setFormMode] = React.useState<"create" | "edit" | "view">("create")
    const [selectedRecord, setSelectedRecord] = React.useState<TData | undefined>()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [recordToDelete, setRecordToDelete] = React.useState<TData | undefined>()

    const handleCreate = () => {
      setFormMode("create")
      setSelectedRecord(undefined)
      setIsFormOpen(true)
    }

    const handleEdit = (record: TData) => {
      setFormMode("edit")
      setSelectedRecord(record)
      setIsFormOpen(true)
    }

    const handleView = (record: TData) => {
      setFormMode("view")
      setSelectedRecord(record)
      setIsFormOpen(true)
    }

    const handleDeleteClick = (record: TData) => {
      setRecordToDelete(record)
      setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
      if (recordToDelete) {
        await deleteRecord(recordToDelete.id)
        setIsDeleteDialogOpen(false)
      }
    }

    const handleFormSubmit = async (formData: Partial<TData>) => {
      if (formMode === "create") {
        await create(formData)
      } else if (formMode === "edit" && selectedRecord) {
        await update({ id: selectedRecord.id, data: formData })
      }
      setIsFormOpen(false)
    }

    const { hasPermission } = usePermissions()

    const canCreate = hasPermission(config.permissions?.create)
    const canEdit = hasPermission(config.permissions?.edit)
    const canView = hasPermission(config.permissions?.view)
    const canDelete = hasPermission(config.permissions?.delete)
    const canExport = hasPermission(config.permissions?.export)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{config.title}</h2>
          </div>
          {canCreate && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </div>

        <DataTable
          columns={config.columns}
          data={data}
          isLoading={isLoading}
          searchQuery={filters.search}
          setSearchQuery={(val) => updateFilter('search', val)}
          onRefresh={refetch}
          onExport={canExport ? () => alert("Export not implemented") : undefined}
          totalCount={meta?.total}
          bulkActions={config.bulkActions}
          onView={canView ? handleView : undefined}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canDelete ? handleDeleteClick : undefined}
          onClone={canCreate ? handleCreate : undefined}
        />

        <FormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          title={config.title}
          mode={formMode}
        >
          <config.FormComponent
            initialData={selectedRecord}
            onSubmit={handleFormSubmit}
            isSubmitting={false}
            mode={formMode}
          />
        </FormDialog>

        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Record"
          description={`Are you sure you want to delete this record? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
        />
      </div>
    )
  }
}
