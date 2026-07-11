import { ResourceKey } from "@/lib/api/resources";
import { CrudConfig } from "@/components/admin/ui/crud/CrudFactory"
import { PortfolioRecord } from "./types"
import { portfolioColumns } from "./columns"
import { PortfolioForm } from "./form"

export const portfolioConfig: CrudConfig<PortfolioRecord> = {
  resource: "portfolio" as ResourceKey,
  title: "Portfolio",
  queryKey: ["portfolio"],
  columns: portfolioColumns,
  FormComponent: PortfolioForm,
  permissions: {
    view: "portfolio.view",
    create: "portfolio.create",
    edit: "portfolio.edit",
    delete: "portfolio.delete"
  }
}
