import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { ActivityLogsRecord } from "./types"
import { activityLogsColumns } from "./columns"
import { ActivityLogsForm } from "./form"

export const activityLogsConfig: CrudConfig<ActivityLogsRecord> = {
  resource: "activity-logs" as ResourceKey,
  title: "Activity Logs",
  queryKey: ["activity-logs"],
  columns: activityLogsColumns,
  FormComponent: ActivityLogsForm,
  permissions: {
    view: "activity-logs.view",
    create: "activity-logs.create",
    edit: "activity-logs.edit",
    delete: "activity-logs.delete"
  }
}
