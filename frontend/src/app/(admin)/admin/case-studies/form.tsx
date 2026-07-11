"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CaseStudiesFormValues, caseStudiesSchema } from "./validation"
import { CaseStudiesRecord } from "./types"

interface CaseStudiesFormProps {
  initialData?: CaseStudiesRecord
  onSubmit: (data: Partial<CaseStudiesRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function CaseStudiesForm({ initialData, onSubmit, isSubmitting, mode }: CaseStudiesFormProps) {
  const form = useForm<CaseStudiesFormValues>({
    resolver: zodResolver(caseStudiesSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      client: "",
      challenge: "",
      solution: "",
      results: "",
      status: "draft"
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Case Study Title" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="case-study-slug" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Client Name" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }: any) => (
              <FormItem className="col-span-2 sm:col-span-1">
                <FormLabel>Status</FormLabel>
                <Select disabled={mode === "view"} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="challenge"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Challenge</FormLabel>
                <FormControl>
                  <Textarea placeholder="What was the problem?" className="h-24" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="solution"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Solution</FormLabel>
                <FormControl>
                  <Textarea placeholder="How did you solve it?" className="h-32" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="results"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Results & Impact</FormLabel>
                <FormControl>
                  <Textarea placeholder="Metrics, ROI, etc." className="h-24" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create Case Study" : mode === "clone" ? "Clone Case Study" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
