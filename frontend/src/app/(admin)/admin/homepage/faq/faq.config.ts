import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Faq } from "./types"
import { columns } from "./columns"
import { FaqForm } from "./form"

export const faqConfig: CrudConfig<Faq> = {
  resource: "faq" as ResourceKey,
  title: "Faq Section",
  queryKey: ["homepage", "faq"],
  columns: columns,
  FormComponent: FaqForm,
  permissions: {
    view: "homepage.faq.view",
    create: "homepage.faq.create",
    edit: "homepage.faq.edit",
    delete: "homepage.faq.delete",
  },
  searchFields: ["title"],
}
