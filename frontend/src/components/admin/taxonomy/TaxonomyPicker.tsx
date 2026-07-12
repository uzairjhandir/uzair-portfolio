'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, X } from 'lucide-react';
import { useTaxonomiesQuery, useTaxonomyTermsQuery } from '@/lib/query/taxonomy/queries';
import { useCreateTaxonomyTermMutation } from '@/lib/query/taxonomy/mutations';
import { TaxonomyTermRef } from '@/lib/query/blog/types';

interface TaxonomyPickerProps {
  taxonomySlug: string; // e.g. "category" or "tag"
  label: string;
  value: TaxonomyTermRef[];
  onChange: (value: TaxonomyTermRef[]) => void;
}

/** Reuses the existing universal Taxonomy API (GET/POST /taxonomies/{uuid}/terms) — no hardcoded options, no new tables. */
export function TaxonomyPicker({ taxonomySlug, label, value, onChange }: TaxonomyPickerProps) {
  const { data: taxonomies } = useTaxonomiesQuery();
  const taxonomy = taxonomies?.find((t) => t.slug === taxonomySlug);
  const { data: terms, isLoading } = useTaxonomyTermsQuery(taxonomy?.uuid);
  const createTerm = useCreateTaxonomyTermMutation();
  const [newTermName, setNewTermName] = useState('');

  const isSelected = (uuid: string) => value.some((v) => v.uuid === uuid);

  const toggle = (term: { uuid: string; name: string; slug: string }) => {
    if (isSelected(term.uuid)) {
      onChange(value.filter((v) => v.uuid !== term.uuid));
    } else {
      onChange([...value, { uuid: term.uuid, name: term.name, slug: term.slug }]);
    }
  };

  const handleCreate = async () => {
    if (!newTermName.trim() || !taxonomy) return;
    const slug = newTermName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      const term = await createTerm.mutateAsync({ taxonomyUuid: taxonomy.uuid, name: newTermName.trim(), slug });
      onChange([...value, { uuid: term.uuid, name: term.name, slug: term.slug }]);
      setNewTermName('');
    } catch {
      // handled by caller's toast wiring if needed
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <Badge key={v.uuid} variant="secondary" className="gap-1">
              {v.name}
              <button type="button" onClick={() => toggle(v)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {(terms || [])
            .filter((t) => !isSelected(t.uuid))
            .map((t) => (
              <button
                key={t.uuid}
                type="button"
                onClick={() => toggle(t)}
                className="text-xs px-2 py-1 rounded-full border border-border/50 text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
              >
                {t.name}
              </button>
            ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder={`New ${label.toLowerCase()}...`}
          value={newTermName}
          onChange={(e) => setNewTermName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
          className="h-8 text-sm"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleCreate} disabled={createTerm.isPending || !taxonomy}>
          {createTerm.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
}
