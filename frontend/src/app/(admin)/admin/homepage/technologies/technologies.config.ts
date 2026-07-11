import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Technologies } from "./types"
import { columns } from "./columns"
import { TechnologiesForm } from "./form"

export const technologiesConfig: CrudConfig<Technologies> = {
  resource: "technologies" as ResourceKey,
  title: "Technologies Section",
  queryKey: ["homepage", "technologies"],
  columns: columns,
  FormComponent: TechnologiesForm,
  permissions: {
    view: "homepage.technologies.view",
    create: "homepage.technologies.create",
    edit: "homepage.technologies.edit",
    delete: "homepage.technologies.delete",
  },
  searchFields: ["title"],
}
