import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { BlogRecord } from "./types"
import { blogColumns } from "./columns"
import { BlogForm } from "./form"

export const blogConfig: CrudConfig<BlogRecord> = {
  resource: "blog" as ResourceKey,
  title: "Blog",
  queryKey: ["blog"],
  columns: blogColumns,
  FormComponent: BlogForm,
  permissions: {
    view: "blog.view",
    create: "blog.create",
    edit: "blog.edit",
    delete: "blog.delete"
  }
}
