import { ResourceKey } from "@/lib/api/resources";
import { columns } from "./columns";
import { Form } from "./form";

export const config = {
  resource: "redirects" as ResourceKey,
  queryKey: ["redirects"],
  title: "Redirects",
  columns,
  FormComponent: Form,
  defaultSort: { field: "created_at", dir: "desc" as const },
};