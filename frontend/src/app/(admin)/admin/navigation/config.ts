import { ResourceKey } from "@/lib/api/resources";
import { columns } from "./columns";
import { Form } from "./form";

export const config = {
  resource: "navigation" as ResourceKey,
  queryKey: ["navigation"],
  title: "Navigation",
  columns,
  FormComponent: Form,
  defaultSort: { field: "created_at", dir: "desc" as const },
};