const fs = require('fs');
const path = require('path');

const modules = ['pages', 'contact', 'navigation', 'footer', 'redirects'];
const baseDir = path.join(__dirname, 'src/app/(admin)/admin');

modules.forEach(mod => {
  const modDir = path.join(baseDir, mod);
  if (!fs.existsSync(modDir)) {
    fs.mkdirSync(modDir, { recursive: true });
  }

  // 1. page.tsx
  const pageContent = `"use client"
import { createCrud } from "@/components/admin/ui/crud/CrudFactory"
import { config } from "./config"

const Crud = createCrud(config);
export default function Page() { return <Crud />; }`;
  fs.writeFileSync(path.join(modDir, 'page.tsx'), pageContent);

  // 2. config.ts
  const configContent = `import { ResourceKey } from "@/lib/api/resources";
import { columns } from "./columns";
import { Form } from "./form";

export const config = {
  resource: "${mod}" as ResourceKey,
  queryKey: ["${mod}"],
  title: "${mod.charAt(0).toUpperCase() + mod.slice(1)}",
  columns,
  FormComponent: Form,
  defaultSort: { field: "created_at", dir: "desc" as const },
};`;
  fs.writeFileSync(path.join(modDir, 'config.ts'), configContent);

  // 3. columns.tsx
  const colContent = `import { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<any>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
];`;
  fs.writeFileSync(path.join(modDir, 'columns.tsx'), colContent);

  // 4. form.tsx
  const formContent = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function Form({ initialData, onSubmit, mode }: any) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ title: (e.target as any).title.value });
    }} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input name="title" defaultValue={initialData?.title} required />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit">{mode === 'create' ? 'Create' : 'Save Changes'}</Button>
      </div>
    </form>
  )
}`;
  fs.writeFileSync(path.join(modDir, 'form.tsx'), formContent);
  
  console.log(`Generated module: ${mod}`);
});
