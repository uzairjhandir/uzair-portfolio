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
import { Loader2 } from 'lucide-react';
import { CrmContact } from '@/lib/query/crm/types';
import { useContactActivitiesQuery } from '@/lib/query/crm/queries';
import { useUpdateContactMutation, useAddActivityMutation } from '@/lib/query/crm/mutations';
import { useAssignableUsersQuery } from '@/lib/query/crm/users';
import { toast } from 'sonner';

interface ContactDetailProps {
  contact: CrmContact;
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'customer', 'archived'];
const PRIORITY_OPTIONS = ['low', 'normal', 'high', 'urgent'];
const ACTIVITY_TYPES = ['note', 'call', 'email', 'meeting', 'task'];

export function ContactDetail({ contact }: ContactDetailProps) {
  const [firstName, setFirstName] = useState(contact.first_name);
  const [lastName, setLastName] = useState(contact.last_name || '');
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone || '');
  const [company, setCompany] = useState(contact.company || '');
  const [jobTitle, setJobTitle] = useState(contact.job_title || '');
  const [website, setWebsite] = useState(contact.website || '');
  const [status, setStatus] = useState(contact.status || 'new');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>(contact.priority || 'normal');
  const [assignedTo, setAssignedTo] = useState(contact.assigned_to?.uuid || 'unassigned');

  const [activityType, setActivityType] = useState('note');
  const [activityBody, setActivityBody] = useState('');

  const { data: activities, isLoading: activitiesLoading } = useContactActivitiesQuery(contact.uuid);
  const { data: users } = useAssignableUsersQuery();
  const updateMutation = useUpdateContactMutation();
  const addActivityMutation = useAddActivityMutation();

  const handleSaveDetails = () => {
    updateMutation.mutate(
      {
        uuid: contact.uuid,
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company,
          job_title: jobTitle,
          website,
          status,
          priority: priority as 'low' | 'normal' | 'high' | 'urgent',
          assigned_to: assignedTo === 'unassigned' ? null : assignedTo,
        },
      },
      {
        onSuccess: () => toast.success('Contact updated'),
        onError: () => toast.error('Failed to update contact'),
      }
    );
  };

  const handleAddActivity = () => {
    if (!activityBody.trim()) return;
    addActivityMutation.mutate(
      { uuid: contact.uuid, type: activityType, body: activityBody },
      {
        onSuccess: () => {
          toast.success('Activity logged');
          setActivityBody('');
        },
        onError: () => toast.error('Failed to log activity'),
      }
    );
  };

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="activities">Activity Timeline ({contact.activities_count})</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'normal' | 'high' | 'urgent')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Assigned To</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {(users || []).map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {contact.message && (
          <div className="space-y-2">
            <Label>Original Message</Label>
            <Textarea value={contact.message} disabled rows={3} />
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveDetails} disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="activities" className="space-y-4 pt-4">
        <div className="flex gap-2">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Log a note, call, email..."
            value={activityBody}
            onChange={(e) => setActivityBody(e.target.value)}
            rows={2}
            className="flex-1"
          />
          <Button onClick={handleAddActivity} disabled={addActivityMutation.isPending || !activityBody.trim()}>
            {addActivityMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activitiesLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
          ) : activities?.length ? (
            activities.map((a) => (
              <div key={a.uuid} className="border rounded-md p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">{a.type.replace('_', ' ')}</span>
                  <span className="text-xs text-muted-foreground">{new Date(a.performed_at).toLocaleString()}</span>
                </div>
                {a.subject && <p className="text-sm font-medium">{a.subject}</p>}
                <p className="text-sm">{a.body}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
