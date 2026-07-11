import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Contact } from "./types"
import { columns } from "./columns"
import { ContactForm } from "./form"

export const contactConfig: CrudConfig<Contact> = {
  resource: "contact" as ResourceKey,
  title: "Contact Section",
  queryKey: ["homepage", "contact"],
  columns: columns,
  FormComponent: ContactForm,
  permissions: {
    view: "homepage.contact.view",
    create: "homepage.contact.create",
    edit: "homepage.contact.edit",
    delete: "homepage.contact.delete",
  },
  searchFields: ["title"],
}
