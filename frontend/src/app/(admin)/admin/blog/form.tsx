"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlogFormValues, blogSchema } from "./validation"
import { BlogRecord } from "./types"

interface BlogFormProps {
  initialData?: BlogRecord
  onSubmit: (data: Partial<BlogRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function BlogForm({ initialData, onSubmit, isSubmitting, mode }: BlogFormProps) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema) as any,
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author_id: "Admin",
      status: "draft",
      categories: [],
      tags: []
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
                  <Input placeholder="Post Title" disabled={mode === "view"} {...field} />
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
                  <Input placeholder="post-title-slug" disabled={mode === "view"} {...field} />
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
            name="excerpt"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short summary..." disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Content (Rich Text)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Post content..." className="h-48" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create Post" : mode === "clone" ? "Clone Post" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
