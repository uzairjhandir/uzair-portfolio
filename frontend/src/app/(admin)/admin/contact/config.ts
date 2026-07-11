import { ResourceKey } from "@/lib/api/resources";
import { columns } from "./columns";
import { Form } from "./form";

export const config = {
  resource: "contact" as ResourceKey,
  queryKey: ["contact"],
  title: "Contact",
  columns,
  FormComponent: Form,
  defaultSort: { field: "created_at", dir: "desc" as const },
};