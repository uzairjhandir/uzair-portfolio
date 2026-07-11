"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SettingsFormValues, settingsSchema } from "./validation"
import { SettingsRecord } from "./types"

interface SettingsFormProps {
  initialData?: SettingsRecord
  onSubmit: (data: Partial<SettingsRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

export function SettingsForm({ initialData, onSubmit, isSubmitting, mode }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: initialData || {
      group: "general",
      key: "",
      value: "",
      type: "string",
      description: ""
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="group"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Settings Group</FormLabel>
                <Select disabled={mode === "view" || mode === "edit"} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="seo">SEO</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="appearance">Appearance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Value Type</FormLabel>
                <Select disabled={mode === "view" || mode === "edit"} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Key</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., site_name" disabled={mode === "view" || mode === "edit"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }: any) => (
              <FormItem className="col-span-2">
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Textarea placeholder="Setting value..." disabled={mode === "view"} {...field} />
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
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="What is this setting for?" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Add Setting" : mode === "clone" ? "Clone Setting" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
