import { ColumnDef } from "@tanstack/react-table";
import { UsersRecord } from "./types";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const usersColumns: ColumnDef<UsersRecord>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {row.original.avatar && <AvatarImage src={row.original.avatar} />}
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span className="capitalize">{row.original.role.replace("_", " ")}</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status as any} />
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.last_login ? new Date(row.original.last_login).toLocaleString() : "Never"}
      </span>
    )
  }
];
