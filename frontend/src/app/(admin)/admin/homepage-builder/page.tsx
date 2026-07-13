'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Copy,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useBlockTypesQuery, useBlocksQuery } from '@/lib/query/blocks/queries';
import {
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useDuplicateBlockMutation,
} from '@/lib/query/blocks/mutations';
import { useHomePageQuery, useSyncPageBuilderMutation, usePublishPageBuilderMutation } from '@/lib/query/pages/builder';
import { SectionEditorDialog } from '@/components/admin/homepage/SectionEditorDialog';
import { BlockContent, BlockType, ContentBlock } from '@/lib/query/blocks/types';

// Curated, fixed default order for homepage sections. There is no backend
// endpoint to read back a previously persisted block order (PageBuilderController::render
// exists but has no route registered), so this is the order shown on every
// load; "Save Order" persists reordering via the real sync endpoint for the
// current session's changes.
const SECTION_ORDER = [
  'hero',
  'about',
  'experience',
  'services',
  'skills',
  'technologies',
  'process',
  'testimonials',
  'client-logos',
  'faq',
  'statistics',
  'contact-section',
];

export default function HomepageBuilderPage() {
  const { data: homePage, isLoading: pageLoading } = useHomePageQuery();
  const { data: blockTypes, isLoading: typesLoading } = useBlockTypesQuery();
  const { data: blocks, isLoading: blocksLoading } = useBlocksQuery();

  const createMutation = useCreateBlockMutation();
  const updateMutation = useUpdateBlockMutation();
  const deleteMutation = useDeleteBlockMutation();
  const duplicateMutation = useDuplicateBlockMutation();
  const syncMutation = useSyncPageBuilderMutation();
  const publishMutation = usePublishPageBuilderMutation();

  const [order, setOrder] = useState<string[]>(SECTION_ORDER);
  const [editing, setEditing] = useState<BlockType | null>(null);
  const [saving, setSaving] = useState(false);

  const sectionTypes = useMemo(() => {
    if (!blockTypes) return [];
    const bySlug = new Map(blockTypes.map((t) => [t.slug, t]));
    return order.map((slug) => bySlug.get(slug)).filter((t): t is BlockType => !!t);
  }, [blockTypes, order]);

  const blockBySlug = useMemo(() => {
    const map = new Map<string, ContentBlock>();
    (blocks || []).forEach((b) => {
      if (!map.has(b.type)) map.set(b.type, b);
    });
    return map;
  }, [blocks]);

  const move = (slug: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const idx = prev.indexOf(slug);
      const swapWith = idx + dir;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const handleSaveOrder = async () => {
    if (!homePage) return;
    const configuredUuids = order
      .map((slug) => blockBySlug.get(slug)?.uuid)
      .filter((uuid): uuid is string => !!uuid);
    try {
      await syncMutation.mutateAsync({ pageUuid: homePage.uuid, blocks: configuredUuids.map((uuid) => ({ uuid })) });
      toast.success('Section order saved');
    } catch {
      toast.error('Failed to save order');
    }
  };

  const handlePublishHome = async () => {
    if (!homePage) return;
    try {
      await publishMutation.mutateAsync({ pageUuid: homePage.uuid, status: 'published' });
      toast.success('Homepage published');
    } catch {
      toast.error('Failed to publish homepage');
    }
  };

  const handleSaveSection = async (data: { name: string; status: string; content: BlockContent }) => {
    if (!editing) return;
    setSaving(true);
    try {
      const existing = blockBySlug.get(editing.slug);
      if (existing) {
        await updateMutation.mutateAsync({ id: existing.uuid, data });
      } else {
        await createMutation.mutateAsync({
          block_type_uuid: editing.uuid,
          name: data.name,
          status: data.status,
          content: data.content,
        });
      }
      toast.success(`${editing.name} saved`);
      setEditing(null);
    } catch (e) {
      toast.error(getErrorMessage(e, 'Failed to save section'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (block: ContentBlock, name: string) => {
    if (!confirm(`Remove "${name}" from the homepage? This deletes the block.`)) return;
    try {
      await deleteMutation.mutateAsync(block.uuid);
      toast.success(`${name} removed`);
    } catch {
      toast.error('Failed to delete section');
    }
  };

  const handleDuplicate = async (block: ContentBlock, name: string) => {
    try {
      await duplicateMutation.mutateAsync(block.uuid);
      toast.success(`${name} duplicated`);
    } catch {
      toast.error('Failed to duplicate section');
    }
  };

  const loading = pageLoading || typesLoading || blocksLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Homepage Builder</h1>
          <p className="text-muted-foreground mt-1">
            Configure the sections that make up the public homepage — built on the existing Pages → Blocks → BlockTypes architecture.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveOrder} disabled={syncMutation.isPending || !homePage}>
            {syncMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Order
          </Button>
          <Button onClick={handlePublishHome} disabled={publishMutation.isPending || !homePage}>
            {publishMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Publish Homepage
          </Button>
        </div>
      </div>

      {!pageLoading && !homePage && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-sm text-destructive">
            No &quot;home&quot; page found. The seeder that creates it may not have run against this database.
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {sectionTypes.map((type, i) => {
            const block = blockBySlug.get(type.slug);
            return (
              <Card key={type.uuid} className="bg-background border-border/50">
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        disabled={i === 0}
                        onClick={() => move(type.slug, -1)}
                        aria-label={`Move ${type.name} up`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        disabled={i === sectionTypes.length - 1}
                        onClick={() => move(type.slug, 1)}
                        aria-label={`Move ${type.name} down`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {block ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}

                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{type.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {block ? (block.content?.headline || block.name || 'Configured') : 'Not configured yet'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {block && (
                      <Badge variant={block.status === 'published' ? 'default' : 'secondary'}>
                        {block.status}
                      </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setEditing(type)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      {block ? 'Edit' : 'Create'}
                    </Button>
                    {block && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Duplicate"
                          aria-label={`Duplicate ${type.name}`}
                          onClick={() => handleDuplicate(block, type.name)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          aria-label={`Delete ${type.name}`}
                          onClick={() => handleDelete(block, type.name)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <SectionEditorDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          blockType={editing}
          existingBlock={blockBySlug.get(editing.slug) || null}
          onSave={handleSaveSection}
          saving={saving}
        />
      )}
    </div>
  );
}
