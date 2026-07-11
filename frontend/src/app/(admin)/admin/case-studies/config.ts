import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { CaseStudiesRecord } from "./types"
import { caseStudiesColumns } from "./columns"
import { CaseStudiesForm } from "./form"

export const caseStudiesConfig: CrudConfig<CaseStudiesRecord> = {
  resource: "case-studies" as ResourceKey,
  title: "Case Studies",
  queryKey: ["case-studies"],
  columns: caseStudiesColumns,
  FormComponent: CaseStudiesForm,
  permissions: {
    view: "case-studies.view",
    create: "case-studies.create",
    edit: "case-studies.edit",
    delete: "case-studies.delete"
  }
}
