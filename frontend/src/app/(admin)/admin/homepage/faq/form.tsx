import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Faq } from "./types"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
})

export type FormValues = z.infer<typeof schema>

interface FormProps {
  initialData?: Faq
  onSubmit: (data: Partial<Faq>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function FaqForm({ initialData, onSubmit, isSubmitting, mode }: FormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData || {
      title: "",
    },
  })

  const handleSubmit = (data: FormValues) => {
    console.log("Mock Submission Data:", data)
    onSubmit(data)
  }

  const isView = mode === "view"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" disabled={isView} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isView && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
