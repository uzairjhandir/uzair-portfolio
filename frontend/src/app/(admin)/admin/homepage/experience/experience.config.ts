import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Experience } from "./types"
import { columns } from "./columns"
import { ExperienceForm } from "./form"

export const experienceConfig: CrudConfig<Experience> = {
  resource: "experience" as ResourceKey,
  title: "Experience Section",
  queryKey: ["homepage", "experience"],
  columns: columns,
  FormComponent: ExperienceForm,
  permissions: {
    view: "homepage.experience.view",
    create: "homepage.experience.create",
    edit: "homepage.experience.edit",
    delete: "homepage.experience.delete",
  },
  searchFields: ["title"],
}
