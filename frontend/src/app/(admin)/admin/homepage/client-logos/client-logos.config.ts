import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { ClientLogos } from "./types"
import { columns } from "./columns"
import { ClientLogosForm } from "./form"

export const clientLogosConfig: CrudConfig<ClientLogos> = {
  resource: "client-logos" as ResourceKey,
  title: "Client Logos Section",
  queryKey: ["homepage", "client-logos"],
  columns: columns,
  FormComponent: ClientLogosForm,
  permissions: {
    view: "homepage.client-logos.view",
    create: "homepage.client-logos.create",
    edit: "homepage.client-logos.edit",
    delete: "homepage.client-logos.delete",
  },
  searchFields: ["title"],
}
