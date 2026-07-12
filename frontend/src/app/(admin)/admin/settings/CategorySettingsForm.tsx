"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SettingCategory } from "@/lib/query/settings/types";
import { useUpdateSettingsMutation } from "@/lib/query/settings/mutations";

function fieldLabel(key: string): string {
  const last = key.split(".").pop() || key;
  return last.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CategorySettingsForm({ category, extra }: { category: SettingCategory; extra?: React.ReactNode }) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initial: Record<string, string | boolean> = {};
    for (const s of category.settings) {
      initial[s.key] = s.type === "boolean" ? Boolean(s.value) : String(s.value ?? "");
    }
    return initial;
  });

  const { mutate, isPending } = useUpdateSettingsMutation();

  const handleSave = () => {
    mutate(values, {
      onSuccess: () => toast.success(`${category.name} settings saved.`),
      onError: () => toast.error("Failed to save settings."),
    });
  };

  if (category.settings.length === 0 && !extra) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No settings configured in this category yet.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.settings.map((setting) => (
          <div key={setting.key} className={setting.type === "boolean" ? "flex items-center gap-2 pt-6" : "space-y-2"}>
            {setting.type === "boolean" ? (
              <>
                <Checkbox
                  id={setting.key}
                  checked={Boolean(values[setting.key])}
                  onCheckedChange={(checked) => setValues((v) => ({ ...v, [setting.key]: Boolean(checked) }))}
                />
                <Label htmlFor={setting.key}>{fieldLabel(setting.key)}</Label>
              </>
            ) : (
              <>
                <Label htmlFor={setting.key}>{fieldLabel(setting.key)}</Label>
                {setting.type === "textarea" ? (
                  <Textarea
                    id={setting.key}
                    value={String(values[setting.key] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    id={setting.key}
                    type={setting.is_encrypted ? "password" : setting.type === "integer" ? "number" : "text"}
                    value={String(values[setting.key] ?? "")}
                    onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                    placeholder={setting.is_encrypted ? "••••••••" : undefined}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {extra}

      {category.settings.length > 0 && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : `Save ${category.name}`}
          </Button>
        </div>
      )}
    </div>
  );
}
