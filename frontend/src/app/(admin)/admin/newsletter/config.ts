import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { NewsletterRecord } from "./types"
import { newsletterColumns } from "./columns"
import { NewsletterForm } from "./form"

export const newsletterConfig: CrudConfig<NewsletterRecord> = {
  resource: "newsletter" as ResourceKey,
  title: "Newsletter",
  queryKey: ["newsletter"],
  columns: newsletterColumns,
  FormComponent: NewsletterForm,
  permissions: {
    view: "newsletter.view",
    create: "newsletter.create",
    edit: "newsletter.edit",
    delete: "newsletter.delete"
  }
}
