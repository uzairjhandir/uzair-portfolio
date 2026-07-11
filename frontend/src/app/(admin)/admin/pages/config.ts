import { ResourceKey } from "@/lib/api/resources";
import { columns } from "./columns";
import { Form } from "./form";

export const config = {
  resource: "pages" as ResourceKey,
  queryKey: ["pages"],
  title: "Pages",
  columns,
  FormComponent: Form,
  defaultSort: { field: "created_at", dir: "desc" as const },
};