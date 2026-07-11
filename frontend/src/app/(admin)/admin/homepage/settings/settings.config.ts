import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Settings } from "./types"
import { columns } from "./columns"
import { SettingsForm } from "./form"

export const settingsConfig: CrudConfig<Settings> = {
  resource: "settings" as ResourceKey,
  title: "Settings Section",
  queryKey: ["homepage", "settings"],
  columns: columns,
  FormComponent: SettingsForm,
  permissions: {
    view: "homepage.settings.view",
    create: "homepage.settings.create",
    edit: "homepage.settings.edit",
    delete: "homepage.settings.delete",
  },
  searchFields: ["title"],
}
