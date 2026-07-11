import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Seo } from "./types"
import { columns } from "./columns"
import { SeoForm } from "./form"

export const seoConfig: CrudConfig<Seo> = {
  resource: "seo" as ResourceKey,
  title: "Seo Section",
  queryKey: ["homepage", "seo"],
  columns: columns,
  FormComponent: SeoForm,
  permissions: {
    view: "homepage.seo.view",
    create: "homepage.seo.create",
    edit: "homepage.seo.edit",
    delete: "homepage.seo.delete",
  },
  searchFields: ["title"],
}
