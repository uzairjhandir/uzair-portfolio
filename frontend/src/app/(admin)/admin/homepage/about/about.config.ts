import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { About } from "./types"
import { columns } from "./columns"
import { AboutForm } from "./form"

export const aboutConfig: CrudConfig<About> = {
  resource: "about" as ResourceKey,
  title: "About Section",
  queryKey: ["homepage", "about"],
  columns: columns,
  FormComponent: AboutForm,
  permissions: {
    view: "homepage.about.view",
    create: "homepage.about.create",
    edit: "homepage.about.edit",
    delete: "homepage.about.delete",
  },
  searchFields: ["title"],
}
