import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { SettingsRecord } from "./types"
import { settingsColumns } from "./columns"
import { SettingsForm } from "./form"

export const settingsConfig: CrudConfig<SettingsRecord> = {
  resource: "settings" as ResourceKey,
  title: "Settings",
  queryKey: ["settings"],
  columns: settingsColumns,
  FormComponent: SettingsForm,
  permissions: {
    view: "settings.view",
    create: "settings.create",
    edit: "settings.edit",
    delete: "settings.delete"
  }
}
