'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { TaxonomyPicker } from '@/components/admin/taxonomy/TaxonomyPicker';
import { DownloadItem, TaxonomyTermRef } from '@/lib/query/downloads/types';
import { DownloadPayload } from '@/lib/query/downloads/mutations';
import { STATUS_LABELS, allowedNextStatuses } from '@/lib/query/downloads/workflow';

interface DownloadFormProps {
  initialData?: DownloadItem;
  onSubmit: (data: DownloadPayload) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit' | 'view' | 'clone';
}

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function DownloadForm({ initialData, onSubmit, isSubmitting, mode }: DownloadFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [latestVersion, setLatestVersion] = useState(initialData?.latest_version || '');
  const [licenseType, setLicenseType] = useState(initialData?.license_type || '');
  const [requiresEmail, setRequiresEmail] = useState(initialData?.requires_email ?? false);
  const [requiresAcceptTerms, setRequiresAcceptTerms] = useState(initialData?.requires_accept_terms ?? false);
  const [file, setFile] = useState<MediaRefValue | null>(
    initialData?.file ? { id: initialData.file.uuid, url: initialData.file.original_url } : null
  );
  const [previewImage, setPreviewImage] = useState<MediaRefValue | null>(
    initialData?.preview_image ? { id: initialData.preview_image.uuid, url: initialData.preview_image.original_url } : null
  );
  const [categories, setCategories] = useState<TaxonomyTermRef[]>(initialData?.categories || []);
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
      latest_version: latestVersion,
      license_type: licenseType,
      requires_email: requiresEmail,
      requires_accept_terms: requiresAcceptTerms,
      media_id: file?.id ?? null,
      preview_media_id: previewImage?.id ?? null,
      seo: { title: seoTitle, description: seoDescription, canonical_url: canonicalUrl },
      categories: categories.map((c) => c.uuid),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
          <TabsTrigger value="organize">Categories</TabsTrigger>
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
                <Select value={status} onValueChange={(v) => setStatus(v as DownloadItem['status'])} disabled={readOnly}>
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

          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} disabled={readOnly} rows={5} />
          </div>
        </TabsContent>

        <TabsContent value="file" className="space-y-4 pt-4">
          <MediaPickerField label="Download File" value={file} onChange={setFile} />
          <MediaPickerField label="Preview Image" value={previewImage} onChange={setPreviewImage} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Version</Label>
              <Input value={latestVersion} onChange={(e) => setLatestVersion(e.target.value)} disabled={readOnly} placeholder="1.0.0" />
            </div>
            <div className="space-y-2">
              <Label>License Type</Label>
              <Input value={licenseType} onChange={(e) => setLicenseType(e.target.value)} disabled={readOnly} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={requiresEmail} onCheckedChange={(v) => setRequiresEmail(!!v)} disabled={readOnly} id="requires_email" />
            <Label htmlFor="requires_email" className="!mb-0">Require email before download</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={requiresAcceptTerms} onCheckedChange={(v) => setRequiresAcceptTerms(!!v)} disabled={readOnly} id="requires_terms" />
            <Label htmlFor="requires_terms" className="!mb-0">Require terms acceptance</Label>
          </div>
        </TabsContent>

        <TabsContent value="organize" className="space-y-4 pt-4">
          <TaxonomyPicker taxonomySlug="category" label="Categories" value={categories} onChange={setCategories} />
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
            {mode === 'create' ? 'Create Download' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
