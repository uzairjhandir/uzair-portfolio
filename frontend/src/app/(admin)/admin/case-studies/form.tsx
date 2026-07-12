'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, X, Plus } from 'lucide-react';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { TaxonomyPicker } from '@/components/admin/taxonomy/TaxonomyPicker';
import { PortfolioPicker } from '@/components/admin/portfolio/PortfolioPicker';
import { CaseStudy, TaxonomyTermRef, OutcomeMetric } from '@/lib/query/case-studies/types';
import { CaseStudyPayload } from '@/lib/query/case-studies/mutations';
import { STATUS_LABELS, allowedNextStatuses } from '@/lib/query/case-studies/workflow';

interface CaseStudyFormProps {
  initialData?: CaseStudy;
  onSubmit: (data: CaseStudyPayload) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit' | 'view' | 'clone';
}

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function CaseStudyForm({ initialData, onSubmit, isSubmitting, mode }: CaseStudyFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [portfolioUuid, setPortfolioUuid] = useState<string | null>(initialData?.portfolio?.uuid ?? null);
  const [challenge, setChallenge] = useState(initialData?.challenge || '');
  const [solution, setSolution] = useState(initialData?.solution || '');
  const [implementation, setImplementation] = useState(initialData?.implementation || '');
  const [results, setResults] = useState(initialData?.results || '');
  const [customerQuote, setCustomerQuote] = useState(initialData?.customer_quote || '');
  const [metrics, setMetrics] = useState<OutcomeMetric[]>(initialData?.outcome_metrics || []);
  const [featuredImage, setFeaturedImage] = useState<MediaRefValue | null>(
    initialData?.featured_image ? { id: initialData.featured_image.uuid, url: initialData.featured_image.original_url } : null
  );
  const [gallery, setGallery] = useState<MediaRefValue[]>(
    initialData?.gallery?.map((m) => ({ id: m.uuid, url: m.original_url })) || []
  );
  const [categories, setCategories] = useState<TaxonomyTermRef[]>(initialData?.categories || []);
  const [technologies, setTechnologies] = useState<TaxonomyTermRef[]>(initialData?.technologies || []);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.seo?.canonical_url || '');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const readOnly = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug,
      excerpt,
      status,
      portfolio_uuid: portfolioUuid,
      challenge,
      solution,
      implementation,
      results,
      customer_quote: customerQuote,
      outcome_metrics: metrics.filter((m) => m.label.trim() || m.value.trim()),
      featured_image_id: featuredImage?.id ?? null,
      gallery: gallery.map((g) => g.id),
      seo: { title: seoTitle, description: seoDescription, canonical_url: canonicalUrl },
      categories: categories.map((c) => c.uuid),
      technologies: technologies.map((t) => t.uuid),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metrics">Metrics &amp; Gallery</TabsTrigger>
          <TabsTrigger value="organize">Categories &amp; Tech</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} disabled={readOnly} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                disabled={readOnly}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              {mode === 'create' ? (
                <Input value={STATUS_LABELS.draft} disabled />
              ) : (
                <Select value={status} onValueChange={(v) => setStatus(v as CaseStudy['status'])} disabled={readOnly}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={status}>{STATUS_LABELS[status]} (current)</SelectItem>
                    {allowedNextStatuses(status).map((next) => (
                      <SelectItem key={next} value={next}>{STATUS_LABELS[next]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <PortfolioPicker value={portfolioUuid} onChange={setPortfolioUuid} />

          <div className="space-y-2">
            <Label>Executive Summary</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Challenge</Label>
            <Textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Solution</Label>
            <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Implementation</Label>
            <Textarea value={implementation} onChange={(e) => setImplementation(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Results</Label>
            <Textarea value={results} onChange={(e) => setResults(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Customer Quote</Label>
            <Input value={customerQuote} onChange={(e) => setCustomerQuote(e.target.value)} disabled={readOnly} />
          </div>

          <MediaPickerField label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Outcome Metrics</Label>
            <p className="text-xs text-muted-foreground">
              Generic label/value pairs (e.g. &quot;Lighthouse Score&quot;: &quot;98&quot;, &quot;Load Time&quot;: &quot;1.2s&quot;).
              The backend has no dedicated Lighthouse/Performance/SEO/Accessibility/Load-Time columns —
              this flexible list is the only supported way to record quantitative outcomes.
            </p>
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder="Label (e.g. Lighthouse Score)"
                    value={m.label}
                    onChange={(e) => {
                      const next = [...metrics];
                      next[i] = { ...next[i], label: e.target.value };
                      setMetrics(next);
                    }}
                    disabled={readOnly}
                  />
                  <Input
                    placeholder="Value (e.g. 98)"
                    value={m.value}
                    onChange={(e) => {
                      const next = [...metrics];
                      next[i] = { ...next[i], value: e.target.value };
                      setMetrics(next);
                    }}
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {!readOnly && (
                <Button type="button" variant="outline" size="sm" onClick={() => setMetrics([...metrics, { label: '', value: '' }])}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Gallery</Label>
            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((g) => (
                  <div key={g.id} className="relative w-20 h-20 rounded-md overflow-hidden border border-border/50 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.url} alt="" className="w-full h-full object-cover" />
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => setGallery(gallery.filter((x) => x.id !== g.id))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {!readOnly && (
              <MediaPickerField
                label="Add to gallery"
                value={null}
                onChange={(v) => {
                  if (v && !gallery.some((g) => g.id === v.id)) setGallery([...gallery, v]);
                }}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="organize" className="space-y-4 pt-4">
          <TaxonomyPicker taxonomySlug="category" label="Categories" value={categories} onChange={setCategories} />
          <TaxonomyPicker taxonomySlug="technology" label="Technologies" value={technologies} onChange={setTechnologies} />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} disabled={readOnly} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Canonical URL</Label>
            <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} disabled={readOnly} />
          </div>
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Create Case Study' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
