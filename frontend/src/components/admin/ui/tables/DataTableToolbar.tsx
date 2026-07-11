import { Table } from "@tanstack/react-table"
import { Search, X, Settings2, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchQuery: string
  setSearchQuery: (val: string) => void
  onRefresh?: () => void
  onExport?: () => void
  bulkActions?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchQuery,
  setSearchQuery,
  onRefresh,
  onExport,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = searchQuery.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-[150px] lg:w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 pl-8"
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setSearchQuery("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {bulkActions && table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="ml-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground border-l pl-4 hidden sm:inline-block">
              {table.getFilteredSelectedRowModel().rows.length} selected
            </span>
            {bulkActions}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {onRefresh && (
          <Button variant="outline" size="sm" className="h-9 hidden sm:flex" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}
        {onExport && (
          <Button variant="outline" size="sm" className="h-9 hidden sm:flex" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
