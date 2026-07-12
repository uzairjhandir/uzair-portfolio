'use client';

import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Search,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Edit2,
  RotateCcw,
  Loader2,
  FileText,
  Film,
} from 'lucide-react';
import { useMediaQuery } from '@/lib/query/media/queries';
import {
  useUploadMediaMutation,
  useUpdateMediaMetadataMutation,
  useReplaceMediaMutation,
  useDeleteMediaMutation,
  useRestoreMediaMutation,
} from '@/lib/query/media/mutations';
import { Media } from '@/lib/query/media/types';
import { getErrorMessage } from '@/lib/utils';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [search, setSearch] = useState('');
  const [mimeFilter, setMimeFilter] = useState<string>('all');
  const [showTrashed, setShowTrashed] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);
  const [editForm, setEditForm] = useState({ alt_text: '', caption: '', title: '', description: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);

  const filters: Record<string, unknown> = { per_page: 60 };
  if (search) filters.search = search;
  if (mimeFilter !== 'all') filters.mime_type = mimeFilter;
  if (showTrashed) filters.trashed = 1;

  const { data, isLoading } = useMediaQuery(filters);
  const uploadMutation = useUploadMediaMutation();
  const updateMetadataMutation = useUpdateMediaMetadataMutation();
  const replaceMutation = useReplaceMediaMutation();
  const deleteMutation = useDeleteMediaMutation();
  const restoreMutation = useRestoreMediaMutation();

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      try {
        await uploadMutation.mutateAsync({ file });
      } catch (err) {
        toast.error(getErrorMessage(err, `Failed to upload ${file.name}`));
      }
    }
    if (files.length) toast.success(`${files.length} file(s) uploaded`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEdit = (media: Media) => {
    setEditing(media);
    setEditForm({
      alt_text: media.alt_text || '',
      caption: media.caption || '',
      title: media.title || '',
      description: media.description || '',
    });
  };

  const handleSaveMetadata = async () => {
    if (!editing) return;
    try {
      await updateMetadataMutation.mutateAsync({ uuid: editing.uuid, data: editForm });
      toast.success('Metadata saved');
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to save metadata'));
    }
  };

  const handleReplaceSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTarget) return;
    try {
      await replaceMutation.mutateAsync({ uuid: replaceTarget, file });
      toast.success('File replaced');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to replace file'));
    }
    setReplaceTarget(null);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  const handleDelete = async (media: Media) => {
    if (!confirm(`Move "${media.file_name}" to trash?`)) return;
    try {
      await deleteMutation.mutateAsync(media.uuid);
      toast.success('Moved to trash');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleRestore = async (media: Media) => {
    try {
      await restoreMutation.mutateAsync(media.uuid);
      toast.success('Restored');
    } catch {
      toast.error('Failed to restore');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-2">Manage all your files, images, and documents.</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFilesSelected}
            accept=".jpg,.jpeg,.png,.webp,.svg,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.mp4,.webm,.mp3"
          />
          <input
            ref={replaceInputRef}
            type="file"
            className="hidden"
            onChange={handleReplaceSelected}
          />
          <Button onClick={handleUploadClick} disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 mr-2" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md border gap-2 flex-wrap">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={mimeFilter} onValueChange={setMimeFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="application/pdf">PDFs</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showTrashed ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowTrashed((s) => !s)}
          >
            {showTrashed ? 'Showing Trash' : 'Show Trash'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.data.map((file) => (
            <Card key={file.uuid} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                {file.mime_type?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.original_url} alt={file.alt_text || file.file_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {file.mime_type?.startsWith('video/') ? (
                      <Film className="w-12 h-12 text-muted-foreground/30" />
                    ) : file.mime_type === 'application/pdf' ? (
                      <FileText className="w-12 h-12 text-muted-foreground/30" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {showTrashed ? (
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleRestore(file)} title="Restore">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        title="Replace"
                        onClick={() => {
                          setReplaceTarget(file.uuid);
                          replaceInputRef.current?.click();
                        }}
                      >
                        <UploadCloud className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8" title="Edit metadata" onClick={() => openEdit(file)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" title="Delete" onClick={() => handleDelete(file)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 text-sm">
                <p className="font-medium truncate">{file.file_name}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatSize(file.size)}</p>
              </div>
            </Card>
          ))}

          {!data?.data.length && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              {showTrashed ? 'Trash is empty.' : 'No media uploaded yet.'}
            </div>
          )}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input value={editForm.alt_text} onChange={(e) => setEditForm((f) => ({ ...f, alt_text: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input value={editForm.caption} onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={3} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={handleSaveMetadata} disabled={updateMetadataMutation.isPending}>
              {updateMetadataMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
