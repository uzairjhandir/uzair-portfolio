'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/query/media/queries';
import { useUploadMediaMutation } from '@/lib/query/media/mutations';
import { ImagePlus, Loader2, X, UploadCloud } from 'lucide-react';

export interface MediaRefValue {
  id: string;
  url: string;
}

interface MediaPickerFieldProps {
  value: MediaRefValue | null | undefined;
  onChange: (value: MediaRefValue | null) => void;
  label?: string;
}

/**
 * Reuses the real Media Library backend (GET /media, POST /media).
 * This is a picker, not a full library management UI — that's Phase 3.
 */
export function MediaPickerField({ value, onChange, label = 'Media' }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useMediaQuery({ per_page: 60 });
  const uploadMutation = useUploadMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadMutation.mutateAsync({ file });
    const media = result.data;
    if (media) {
      onChange({ id: media.uuid, url: media.original_url });
      setOpen(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="flex items-center gap-3">
        {value?.url ? (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border/50 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-md border border-dashed border-border/50 flex items-center justify-center text-muted-foreground">
            <ImagePlus className="w-6 h-6" />
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              {value ? 'Change' : 'Select from Media Library'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Media</DialogTitle>
            </DialogHeader>

            <div className="flex justify-end mb-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={uploadMutation.isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4 mr-2" />
                )}
                Upload new
              </Button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : data?.data.length ? (
                data.data.map((m) => (
                  <button
                    key={m.uuid}
                    type="button"
                    onClick={() => {
                      onChange({ id: m.uuid, url: m.original_url });
                      setOpen(false);
                    }}
                    className="aspect-square rounded-md overflow-hidden border border-border/50 hover:border-primary transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.original_url} alt={m.file_name} className="w-full h-full object-cover" />
                  </button>
                ))
              ) : (
                <p className="col-span-full text-sm text-muted-foreground text-center py-8">
                  No media uploaded yet. Upload one above.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
