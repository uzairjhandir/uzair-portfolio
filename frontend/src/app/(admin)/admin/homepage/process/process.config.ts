import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Process } from "./types"
import { columns } from "./columns"
import { ProcessForm } from "./form"

export const processConfig: CrudConfig<Process> = {
  resource: "process" as ResourceKey,
  title: "Process Section",
  queryKey: ["homepage", "process"],
  columns: columns,
  FormComponent: ProcessForm,
  permissions: {
    view: "homepage.process.view",
    create: "homepage.process.create",
    edit: "homepage.process.edit",
    delete: "homepage.process.delete",
  },
  searchFields: ["title"],
}
