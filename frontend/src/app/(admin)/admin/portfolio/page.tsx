"use client"

import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { portfolioConfig } from "./config"

const Crud = createCrud(portfolioConfig);

export default function PortfolioPage() {
  return <Crud />;
}
