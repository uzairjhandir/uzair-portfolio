import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableToolbar } from "./DataTableToolbar"
import { ErrorState } from "../states/ErrorState"
import { EmptyState } from "../states/EmptyState"
import { getErrorMessage } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  isError?: boolean
  error?: unknown
  searchQuery?: string
  setSearchQuery?: (val: string) => void
  onRefresh?: () => void
  onExport?: () => void
  bulkActions?: React.ReactNode
  totalCount?: number
  onView?: (row: TData) => void
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
  onClone?: (row: TData) => void
  /** Server-driven pagination. When provided, DataTable stops slicing `data` itself and defers to these. */
  manualPagination?: boolean
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isError = false,
  error,
  searchQuery = "",
  setSearchQuery,
  onRefresh,
  onExport,
  bulkActions,
  totalCount,
  onView,
  onEdit,
  onDelete,
  onClone,
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(pagination ? { pagination } : {}),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(manualPagination ? { manualPagination: true, pageCount: pageCount ?? -1, onPaginationChange } : {}),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      crudActions: {
        onView,
        onEdit,
        onDelete,
        onClone,
      }
    }
  })

  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorState message={getErrorMessage(error, "Failed to load data.")} onRetry={onRefresh} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {setSearchQuery && (
        <DataTableToolbar
          table={table}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={onRefresh}
          onExport={onExport}
          bulkActions={bulkActions}
        />
      )}
      {!isLoading && data.length === 0 ? (
        <EmptyState
          title="No records found"
          description={searchQuery ? "Try a different search term." : "Get started by creating a new record."}
        />
      ) : (
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <DataTablePagination table={table} totalCount={totalCount} />
    </div>
  )
}
