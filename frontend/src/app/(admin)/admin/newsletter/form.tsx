"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewsletterFormValues, newsletterSchema } from "./validation"
import { NewsletterRecord } from "./types"

interface NewsletterFormProps {
  initialData?: NewsletterRecord
  onSubmit: (data: Partial<NewsletterRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function NewsletterForm({ initialData, onSubmit, isSubmitting, mode }: NewsletterFormProps) {
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema) as any,
    defaultValues: initialData || {
      email: "",
      status: "subscribed"
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Subscriber Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" disabled={mode === "view" || mode === "edit"} {...field} />
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
                    <SelectItem value="subscribed">Subscribed</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Add Subscriber" : mode === "clone" ? "Clone Subscriber" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
