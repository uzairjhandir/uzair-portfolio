import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Hero } from "./types"
import { columns } from "./columns"
import { HeroForm } from "./form"

export const heroConfig: CrudConfig<Hero> = {
  resource: "hero" as ResourceKey,
  title: "Hero Section",
  // Empty endpoint for now due to API-agnostic architecture
  // Handled dynamically by genericService's mock router
  queryKey: ["homepage", "hero"],
  columns: columns,
  FormComponent: HeroForm,
  permissions: {
    view: "homepage.hero.view",
    create: "homepage.hero.create",
    edit: "homepage.hero.edit",
    delete: "homepage.hero.delete",
  },
  searchFields: ["title", "subtitle"],
  defaultSort: { field: "sortOrder", dir: "asc" }
}
