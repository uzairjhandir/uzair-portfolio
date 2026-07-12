'use client';

import { useEffect, useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/ui/forms/RichTextEditor';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { TaxonomyPicker } from '@/components/admin/taxonomy/TaxonomyPicker';
import { BlogPost, TaxonomyTermRef } from '@/lib/query/blog/types';
import { BlogPayload } from '@/lib/query/blog/mutations';

interface BlogFormProps {
  initialData?: BlogPost;
  onSubmit: (data: BlogPayload) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit' | 'view' | 'clone';
}

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function BlogForm({ initialData, onSubmit, isSubmitting, mode }: BlogFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!initialData);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [featuredImage, setFeaturedImage] = useState<MediaRefValue | null>(
    initialData?.featured_image ? { id: initialData.featured_image.uuid, url: initialData.featured_image.original_url } : null
  );
  const [categories, setCategories] = useState<TaxonomyTermRef[]>(initialData?.categories || []);
  const [tags, setTags] = useState<TaxonomyTermRef[]>(initialData?.tags || []);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.seo?.canonical_url || '');
  const [publishAt, setPublishAt] = useState(initialData?.publish_at ? initialData.publish_at.slice(0, 16) : '');

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const readOnly = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug,
      excerpt,
      content,
      status,
      featured_image_id: featuredImage?.id ?? null,
      publish_at: publishAt ? new Date(publishAt).toISOString() : null,
      seo: { title: seoTitle, description: seoDescription, canonical_url: canonicalUrl },
      categories: categories.map((c) => c.uuid),
      tags: tags.map((t) => t.uuid),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="organize">Categories &amp; Tags</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={readOnly} required />
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
              <Select value={status} onValueChange={(v) => setStatus(v as BlogPost['status'])} disabled={readOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Summary / Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} disabled={readOnly} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={content} onChange={setContent} readOnly={readOnly} placeholder="Write the post..." />
          </div>

          <MediaPickerField label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />

          <div className="space-y-2">
            <Label>Publish Date</Label>
            <Input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              disabled={readOnly}
            />
          </div>
        </TabsContent>

        <TabsContent value="organize" className="space-y-4 pt-4">
          <TaxonomyPicker taxonomySlug="category" label="Categories" value={categories} onChange={setCategories} />
          <TaxonomyPicker taxonomySlug="tag" label="Tags" value={tags} onChange={setTags} />
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
            {mode === 'create' ? 'Create Post' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
}
