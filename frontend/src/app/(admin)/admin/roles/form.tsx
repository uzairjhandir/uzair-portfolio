"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RolesFormValues, rolesSchema } from "./validation"
import { RolesRecord } from "./types"

interface RolesFormProps {
  initialData?: RolesRecord
  onSubmit: (data: Partial<RolesRecord>) => void
  isSubmitting: boolean
  mode: "create" | "edit" | "view" | "clone"
}

// In a real app, this would be grouped and map over all available system permissions
const availablePermissions = [
  "blog.view", "blog.create", "blog.edit", "blog.delete",
  "portfolio.view", "portfolio.create", "portfolio.edit", "portfolio.delete",
  "users.view", "users.create", "users.edit", "users.delete",
]

export function RolesForm({ initialData, onSubmit, isSubmitting, mode }: RolesFormProps) {
  const form = useForm<RolesFormValues>({
    resolver: zodResolver(rolesSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      permissions: [],
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Editor" disabled={mode === "view"} {...field} />
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
                  <Textarea placeholder="What can this role do?" disabled={mode === "view"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissions"
            render={({ field }) => {
              const selected = field.value || []
              return (
                <FormItem>
                  <FormLabel>Permissions Matrix</FormLabel>
                  <div className="border rounded-md p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/20">
                    {availablePermissions.map(permission => (
                      <label key={permission} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox"
                          className="rounded border-input"
                          disabled={mode === "view"}
                          checked={selected.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...selected, permission])
                            } else {
                              field.onChange(selected.filter((p: string) => p !== permission))
                            }
                          }}
                        />
                        <span>{permission}</span>
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>

        {mode !== "view" && (
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create Role" : mode === "clone" ? "Clone Role" : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
