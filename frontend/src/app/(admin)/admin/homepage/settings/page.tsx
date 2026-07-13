'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { useSettingsQuery } from '@/lib/query/settings/queries';
import { useUpdateSettingsMutation } from '@/lib/query/settings/mutations';
import { getErrorMessage } from '@/lib/utils';
import { LoadingState } from '@/components/admin/ui/states/LoadingState';
import { ErrorState } from '@/components/admin/ui/states/ErrorState';

// The backend has no dedicated "homepage" settings category — it groups
// site-wide config into categories (general, seo, social, ...). The closest
// real match for "Homepage Settings" is the "general" category (site name,
// logo, favicon), which is what actually renders on the public homepage.
const CATEGORY_SLUG = 'general';

function parseValue(raw: unknown): string {
  if (raw === null || raw === undefined) return '';
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'string' ? parsed : String(parsed ?? '');
    } catch {
      return raw;
    }
  }
  return String(raw);
}

export default function HomepageSettingsPage() {
  const { data, isLoading, isError, error, refetch } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const [values, setValues] = useState<Record<string, string>>({});
  const [media, setMedia] = useState<Record<string, MediaRefValue | null>>({});

  const category = data?.[CATEGORY_SLUG];

  useEffect(() => {
    if (!category) return;
    const next: Record<string, string> = {};
    const nextMedia: Record<string, MediaRefValue | null> = {};
    category.settings.forEach((s) => {
      if (s.type === 'image') {
        const parsed = parseValue(s.value);
        nextMedia[s.key] = parsed ? { id: parsed, url: parsed } : null;
      } else {
        next[s.key] = parseValue(s.value);
      }
    });
    // Seeds local form state from the fetched settings once they arrive —
    // a changing `key` prop isn't practical here since this is a whole page,
    // not a re-mountable child.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(next);
    setMedia(nextMedia);
  }, [category]);

  const handleSave = async () => {
    const payload: Record<string, unknown> = { ...values };
    Object.entries(media).forEach(([key, m]) => {
      payload[key] = m?.url || null;
    });
    try {
      await updateMutation.mutateAsync(payload);
      toast.success('Homepage settings saved');
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to save settings'));
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading homepage settings..." />;
  }

  if (isError) {
    return <ErrorState message={getErrorMessage(error, "Failed to load homepage settings.")} onRetry={refetch} />;
  }

  if (!category) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          No &quot;{CATEGORY_SLUG}&quot; settings category found on the backend.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Homepage Settings</h1>
        <p className="text-muted-foreground mt-1">
          Site identity shown across the public homepage (backend category: <code>{CATEGORY_SLUG}</code>).
        </p>
      </div>

      <Card className="bg-background border-border/50">
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {category.settings.map((s) =>
            s.type === 'image' ? (
              <MediaPickerField
                key={s.key}
                label={s.key}
                value={media[s.key]}
                onChange={(v) => setMedia((prev) => ({ ...prev, [s.key]: v }))}
              />
            ) : (
              <div key={s.key} className="space-y-2">
                <Label>{s.key}</Label>
                <Input
                  value={values[s.key] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [s.key]: e.target.value }))}
                />
              </div>
            )
          )}
          {category.settings.length === 0 && (
            <p className="text-sm text-muted-foreground">No settings keys in this category yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
