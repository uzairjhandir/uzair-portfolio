"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrmFormValues, crmSchema } from "./validation"
import { CrmRecord } from "./types"

interface CrmFormProps {
  initialData?: CrmRecord
  onSubmit: (data: Partial<CrmRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function CrmForm({ initialData, onSubmit, isSubmitting, mode }: CrmFormProps) {
  const form = useForm<CrmFormValues>({
    resolver: zodResolver(crmSchema) as any,
    defaultValues: initialData || {
      name: "",
      email: "",
      subject: "",
      message: "",
      source: "website",
      status: "new",
      priority: "medium",
      notes: ""
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Lead Name" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Inquiry Subject" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Original message..." className="h-24" disabled={mode === "view"} {...field} />
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
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select disabled={mode === "view"} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Internal Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add a note..." disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create Lead" : mode === "clone" ? "Clone Lead" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
