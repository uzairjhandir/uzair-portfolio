'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Loader2, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/admin/ui/tables/DataTable';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { useCampaignListQuery, useNewsletterListsQuery } from '@/lib/query/newsletter/queries';
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  CampaignPayload,
} from '@/lib/query/newsletter/mutations';
import { Campaign } from '@/lib/query/newsletter/types';

export function CampaignsTab() {
  const { data, isLoading, isFetching } = useCampaignListQuery();
  const { data: lists } = useNewsletterListsQuery();
  const createMutation = useCreateCampaignMutation();
  const updateMutation = useUpdateCampaignMutation();
  const deleteMutation = useDeleteCampaignMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [selectedLists, setSelectedLists] = useState<string[]>([]);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSubject('');
    setHtmlBody('');
    setSelectedLists([]);
    setDialogOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setName(c.name);
    setSubject(c.subject);
    setHtmlBody(c.html_body);
    setSelectedLists(c.lists.map((l) => l.slug));
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CampaignPayload = { name, subject, html_body: htmlBody, lists: selectedLists };
    if (editing) {
      updateMutation.mutate(
        { uuid: editing.uuid, data: payload },
        {
          onSuccess: () => { toast.success('Campaign updated'); setDialogOpen(false); },
          onError: () => toast.error('Failed to update campaign (only draft campaigns can be edited)'),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success('Campaign created'); setDialogOpen(false); },
        onError: () => toast.error('Failed to create campaign'),
      });
    }
  };

  const toggleList = (slug: string) => {
    setSelectedLists((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.subject}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'lists',
      header: 'Lists',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.lists.map((l) => l.name).join(', ') || '—'}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{new Date(row.original.created_at).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          {row.original.status === 'draft' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
        totalCount={data?.total}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>HTML Body</Label>
              <Textarea value={htmlBody} onChange={(e) => setHtmlBody(e.target.value)} rows={6} required />
            </div>
            <div className="space-y-2">
              <Label>Lists</Label>
              <div className="flex flex-wrap gap-2">
                {(lists || []).map((l) => (
                  <Badge
                    key={l.uuid}
                    variant={selectedLists.includes(l.slug) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleList(l.slug)}
                  >
                    {l.name}
                  </Badge>
                ))}
                {!lists?.length && <p className="text-xs text-muted-foreground">No lists exist yet — create one in the Lists tab first.</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || selectedLists.length === 0}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? 'Save Changes' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete campaign &quot;{deleteTarget?.name}&quot;?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.uuid, {
                  onSuccess: () => { toast.success('Campaign deleted'); setDeleteTarget(null); },
                  onError: () => toast.error('Delete failed'),
                });
              }}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
