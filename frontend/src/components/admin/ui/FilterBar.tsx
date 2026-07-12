import * as React from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

interface FilterBarProps {
  groups: FilterGroup[]
  activeFilters: Record<string, string[]>
  onFilterChange: (groupId: string, value: string, checked: boolean) => void
  onClearFilters: () => void
  className?: string
}

export function FilterBar({ groups, activeFilters, onFilterChange, onClearFilters, className }: FilterBarProps) {
  const activeCount = Object.values(activeFilters).flat().length

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 border-dashed">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeCount > 0 && (
              <>
                <div className="mx-2 h-4 w-px bg-border" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                  {activeCount}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeCount} active
                  </Badge>
                </div>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {groups.map((group, index) => (
            <React.Fragment key={group.id}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              {group.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={activeFilters[group.id]?.includes(option.value)}
                  onCheckedChange={(checked) => onFilterChange(group.id, option.value, checked)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </React.Fragment>
          ))}
          {activeCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  onClearFilters()
                }}
                className="justify-center text-center font-medium"
              >
                Clear all
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeCount > 0 && (
        <Button
          variant="ghost"
          onClick={onClearFilters}
          className="h-9 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  )
}

// dropdown-menu.tsx only exports DropdownMenuCheckboxItem, not a plain
// DropdownMenuItem — this renders as an unstyled div wrapper, not a Radix
// primitive, so it uses standard div ref/props types rather than borrowing
// the checkbox item's (which required `any` casts to force-fit).
const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"
