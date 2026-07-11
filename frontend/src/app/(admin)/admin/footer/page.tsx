"use client"
import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { config } from "./config"

const Crud = createCrud(config);
export default function Page() { return <Crud />; }