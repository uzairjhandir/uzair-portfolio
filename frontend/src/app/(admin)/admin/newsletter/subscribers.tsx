'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/admin/ui/tables/DataTable';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { useSubscriberListQuery } from '@/lib/query/newsletter/queries';
import { useDeleteSubscriberMutation } from '@/lib/query/newsletter/mutations';
import { Subscriber } from '@/lib/query/newsletter/types';

const STATUS_OPTIONS = ['pending', 'confirmed', 'unsubscribed', 'bounced', 'complained', 'suppressed'];

export function SubscribersTab() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);

  const { data, isLoading, isFetching } = useSubscriberListQuery({
    ...(search ? { search } : {}),
    ...(status !== 'all' ? { status } : {}),
  });
  const deleteMutation = useDeleteSubscriberMutation();

  const columns: ColumnDef<Subscriber>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.email}</p>
          <p className="text-xs text-muted-foreground">{row.original.first_name} {row.original.last_name}</p>
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
        <span className="text-sm text-muted-foreground">
          {row.original.lists.map((l) => l.name).join(', ') || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Subscribed',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{new Date(row.original.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading || isFetching}
        searchQuery={search}
        setSearchQuery={setSearch}
        totalCount={data?.total}
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete subscriber?</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{deleteTarget?.email}&quot;. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deleteTarget) return;
                deleteMutation.mutate(deleteTarget.uuid, {
                  onSuccess: () => {
                    toast.success('Subscriber deleted');
                    setDeleteTarget(null);
                  },
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
