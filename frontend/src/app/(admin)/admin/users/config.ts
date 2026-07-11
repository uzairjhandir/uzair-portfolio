import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { UsersRecord } from "./types"
import { usersColumns } from "./columns"
import { UsersForm } from "./form"

export const usersConfig: CrudConfig<UsersRecord> = {
  resource: "users" as ResourceKey,
  title: "Users",
  queryKey: ["users"],
  columns: usersColumns,
  FormComponent: UsersForm,
  permissions: {
    view: "users.view",
    create: "users.create",
    edit: "users.edit",
    delete: "users.delete"
  }
}
