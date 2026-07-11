import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Service } from "./types"

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().default("Code"),
  color: z.string().default("#3B82F6"),
  order: z.coerce.number().default(0),
  featured: z.boolean().default(false),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  initialData?: Service
  onSubmit: (data: Partial<Service>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function ServiceForm({ initialData, onSubmit, isSubmitting, mode }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: initialData || {
      title: "",
      description: "",
      icon: "Code",
      color: "#3B82F6",
      order: 0,
      featured: false,
    },
  })

  const handleSubmit = (data: ServiceFormValues) => {
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
                <Input placeholder="Service title" disabled={isView} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Service description" disabled={isView} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon (Lucide name)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Code, Server" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input type="color" disabled={isView} className="w-12 p-1 h-10" {...field} />
                    <Input type="text" disabled={isView} className="flex-1" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
