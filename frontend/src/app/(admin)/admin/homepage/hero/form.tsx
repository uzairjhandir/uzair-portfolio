import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Hero } from "./types"
import { MediaPicker } from "@/components/admin/ui/media/MediaPicker"

const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  typingText: z.string().optional(),
  primaryCta: z.string().optional(),
  secondaryCta: z.string().optional(),
  backgroundImage: z.string().optional(),
  status: z.string().default("Published"),
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
})

export type HeroFormValues = z.infer<typeof heroSchema>

interface HeroFormProps {
  initialData?: Hero
  onSubmit: (data: Partial<Hero>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function HeroForm({ initialData, onSubmit, isSubmitting, mode }: HeroFormProps) {
  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema) as any,
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      typingText: "",
      primaryCta: "",
      secondaryCta: "",
      backgroundImage: "",
      status: "Published",
      featured: false,
      sortOrder: 0,
    },
  })

  // Mock submission
  const handleSubmit = (data: HeroFormValues) => {
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
                <Input placeholder="Enter hero title" disabled={isView} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Enter subtitle" disabled={isView} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="primaryCta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary CTA</FormLabel>
                <FormControl>
                  <Input placeholder="Button text" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryCta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary CTA</FormLabel>
                <FormControl>
                  <Input placeholder="Button text" disabled={isView} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <div className="mt-2">
                  <MediaPicker 
                    value={field.value} 
                    onChange={field.onChange} 
                  />
                </div>
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
