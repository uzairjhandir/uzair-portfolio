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
import { Loader2, X } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/ui/forms/RichTextEditor';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { TaxonomyPicker } from '@/components/admin/taxonomy/TaxonomyPicker';
import { PortfolioProject, TaxonomyTermRef } from '@/lib/query/portfolio/types';
import { PortfolioPayload } from '@/lib/query/portfolio/mutations';
import { STATUS_LABELS, allowedNextStatuses } from '@/lib/query/portfolio/workflow';

interface PortfolioFormProps {
  initialData?: PortfolioProject;
  onSubmit: (data: PortfolioPayload) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit' | 'view' | 'clone';
}

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function PortfolioForm({ initialData, onSubmit, isSubmitting, mode }: PortfolioFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [clientName, setClientName] = useState(initialData?.client_name || '');
  const [projectUrl, setProjectUrl] = useState(initialData?.project_url || '');
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.repository_url || '');
  const [completionDate, setCompletionDate] = useState(initialData?.completion_date || '');
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
      content,
      status,
      client_name: clientName,
      project_url: projectUrl,
      repository_url: repositoryUrl,
      completion_date: completionDate || null,
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
          <TabsTrigger value="media">Gallery</TabsTrigger>
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
                <Select value={status} onValueChange={(v) => setStatus(v as PortfolioProject['status'])} disabled={readOnly}>
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
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Completion Date</Label>
              <Input type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Project URL</Label>
              <Input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Repository URL</Label>
              <Input value={repositoryUrl} onChange={(e) => setRepositoryUrl(e.target.value)} disabled={readOnly} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Full Description</Label>
            <RichTextEditor value={content} onChange={setContent} readOnly={readOnly} placeholder="Describe the project..." />
          </div>

          <MediaPickerField label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
        </TabsContent>

        <TabsContent value="media" className="space-y-4 pt-4">
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
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
