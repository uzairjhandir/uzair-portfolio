'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaPickerField, MediaRefValue } from '@/components/admin/media/MediaPickerField';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { BlockContent, BlockType, ContentBlock, SectionAction, SectionItem } from '@/lib/query/blocks/types';

interface SectionEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockType: BlockType;
  existingBlock: ContentBlock | null;
  onSave: (data: { name: string; status: string; content: BlockContent }) => Promise<void>;
  saving: boolean;
}

const emptyContent = (): BlockContent => ({
  headline: '',
  description: '',
  media: null,
  actions: [],
  items: [],
});

export function SectionEditorDialog({
  open,
  onOpenChange,
  blockType,
  existingBlock,
  onSave,
  saving,
}: SectionEditorDialogProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('draft');
  const [content, setContent] = useState<BlockContent>(emptyContent());

  useEffect(() => {
    // Resets the form to the block being edited (or blank, for a new one)
    // each time the dialog opens. The React-recommended alternative is a
    // changing `key` prop on this component instead of an effect, but that
    // requires the parent to track a per-block key — out of scope for a
    // stabilization pass.
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(existingBlock?.name || blockType.name);
      setStatus(existingBlock?.status || 'draft');
      setContent({ ...emptyContent(), ...(existingBlock?.content || {}) });
    }
  }, [open, existingBlock, blockType]);

  const slots = blockType.slots || [];
  const has = (slot: string) => slots.includes(slot);

  const updateActions = (index: number, patch: Partial<SectionAction>) => {
    setContent((c) => {
      const actions = [...(c.actions || [])];
      actions[index] = { ...actions[index], ...patch };
      return { ...c, actions };
    });
  };

  const updateItems = (index: number, patch: Partial<SectionItem>) => {
    setContent((c) => {
      const items = [...(c.items || [])];
      items[index] = { ...items[index], ...patch };
      return { ...c, items };
    });
  };

  const handleSave = async () => {
    await onSave({ name, status, content });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blockType.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Internal Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {has('headline') && (
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                value={content.headline || ''}
                onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))}
              />
            </div>
          )}

          {has('description') && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={content.description || ''}
                onChange={(e) => setContent((c) => ({ ...c, description: e.target.value }))}
              />
            </div>
          )}

          {has('content') && (
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                rows={4}
                value={content.content || ''}
                onChange={(e) => setContent((c) => ({ ...c, content: e.target.value }))}
              />
            </div>
          )}

          {has('media') && (
            <MediaPickerField
              label="Media"
              value={content.media}
              onChange={(v: MediaRefValue | null) => setContent((c) => ({ ...c, media: v }))}
            />
          )}

          {has('actions') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Actions / Buttons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContent((c) => ({ ...c, actions: [...(c.actions || []), { label: '', href: '' }] }))
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {(content.actions || []).map((action, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder="Label"
                    value={action.label}
                    onChange={(e) => updateActions(i, { label: e.target.value })}
                  />
                  <Input
                    placeholder="Link (/path or https://...)"
                    value={action.href}
                    onChange={(e) => updateActions(i, { href: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        actions: (c.actions || []).filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {has('items') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      items: [...(c.items || []), { title: '', description: '', link: '', media: null }],
                    }))
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add item
                </Button>
              </div>
              {(content.items || []).map((item, i) => (
                <div key={i} className="rounded-lg border border-border/50 p-3 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => updateItems(i, { title: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          items: (c.items || []).filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => updateItems(i, { description: e.target.value })}
                  />
                  <Input
                    placeholder="Link (optional)"
                    value={item.link || ''}
                    onChange={(e) => updateItems(i, { link: e.target.value })}
                  />
                  <MediaPickerField
                    label="Icon / Image (optional)"
                    value={item.media}
                    onChange={(v: MediaRefValue | null) => updateItems(i, { media: v })}
                  />
                </div>
              ))}
              {(content.items || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No items yet.</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
