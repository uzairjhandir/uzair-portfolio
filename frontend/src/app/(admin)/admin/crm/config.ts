import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { CrmRecord } from "./types"
import { crmColumns } from "./columns"
import { CrmForm } from "./form"

export const crmConfig: CrudConfig<CrmRecord> = {
  resource: "crm" as ResourceKey,
  title: "Crm",
  queryKey: ["crm"],
  columns: crmColumns,
  FormComponent: CrmForm,
  permissions: {
    view: "crm.view",
    create: "crm.create",
    edit: "crm.edit",
    delete: "crm.delete"
  }
}
