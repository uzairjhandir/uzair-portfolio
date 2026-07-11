"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PortfolioFormValues, portfolioSchema } from "./validation"
import { PortfolioRecord } from "./types"

interface PortfolioFormProps {
  initialData?: PortfolioRecord
  onSubmit: (data: Partial<PortfolioRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function PortfolioForm({ initialData, onSubmit, isSubmitting, mode }: PortfolioFormProps) {
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      client: "",
      description: "",
      technologies: [],
      gallery: [],
      github_url: "",
      live_url: "",
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
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Enterprise E-commerce" disabled={mode === "view"} {...field} />
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
                  <Input placeholder="enterprise-ecommerce" disabled={mode === "view"} {...field} />
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
                <FormLabel>Client (Optional)</FormLabel>
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
              <FormItem>
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
            name="github_url"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="live_url"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Description (Rich Text)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Project description..." className="h-48" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create Project" : mode === "clone" ? "Clone Project" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
