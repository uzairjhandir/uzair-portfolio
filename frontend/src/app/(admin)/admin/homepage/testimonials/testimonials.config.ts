import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { Testimonials } from "./types"
import { columns } from "./columns"
import { TestimonialsForm } from "./form"

export const testimonialsConfig: CrudConfig<Testimonials> = {
  resource: "testimonials" as ResourceKey,
  title: "Testimonials Section",
  queryKey: ["homepage", "testimonials"],
  columns: columns,
  FormComponent: TestimonialsForm,
  permissions: {
    view: "homepage.testimonials.view",
    create: "homepage.testimonials.create",
    edit: "homepage.testimonials.edit",
    delete: "homepage.testimonials.delete",
  },
  searchFields: ["title"],
}
