import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface StubRow {
  id: string | number;
  title: string;
}

interface StubFormProps {
  initialData?: StubRow;
  onSubmit: (data: Partial<StubRow>) => void;
  mode: "create" | "edit" | "view" | "clone";
}

export function Form({ initialData, onSubmit, mode }: StubFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const title = (e.currentTarget.elements.namedItem('title') as HTMLInputElement).value;
      onSubmit({ title });
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
}