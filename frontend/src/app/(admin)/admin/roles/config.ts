import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { RolesRecord } from "./types"
import { rolesColumns } from "./columns"
import { RolesForm } from "./form"

export const rolesConfig: CrudConfig<RolesRecord> = {
  resource: "roles" as ResourceKey,
  title: "Roles",
  queryKey: ["roles"],
  columns: rolesColumns,
  FormComponent: RolesForm,
  permissions: {
    view: "roles.view",
    create: "roles.create",
    edit: "roles.edit",
    delete: "roles.delete"
  }
}
