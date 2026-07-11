import { Input } from "@/components/ui/input"
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
}