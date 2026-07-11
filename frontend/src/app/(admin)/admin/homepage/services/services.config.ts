import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Service } from "./types"
import { columns } from "./columns"
import { ServiceForm } from "./form"

export const servicesConfig: CrudConfig<Service> = {
  resource: "services" as ResourceKey,
  title: "Services Section",
  queryKey: ["homepage", "services"],
  columns: columns,
  FormComponent: ServiceForm,
  permissions: {
    view: "homepage.services.view",
    create: "homepage.services.create",
    edit: "homepage.services.edit",
    delete: "homepage.services.delete",
  },
  searchFields: ["title", "description"],
  defaultSort: { field: "order", dir: "asc" }
}
