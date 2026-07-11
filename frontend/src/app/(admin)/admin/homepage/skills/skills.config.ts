import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Skills } from "./types"
import { columns } from "./columns"
import { SkillsForm } from "./form"

export const skillsConfig: CrudConfig<Skills> = {
  resource: "skills" as ResourceKey,
  title: "Skills Section",
  queryKey: ["homepage", "skills"],
  columns: columns,
  FormComponent: SkillsForm,
  permissions: {
    view: "homepage.skills.view",
    create: "homepage.skills.create",
    edit: "homepage.skills.edit",
    delete: "homepage.skills.delete",
  },
  searchFields: ["title"],
}
