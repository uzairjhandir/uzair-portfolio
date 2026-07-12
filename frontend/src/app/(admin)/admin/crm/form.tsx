'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ContactCreatePayload } from '@/lib/query/crm/mutations';

interface ContactCreateFormProps {
  onSubmit: (data: ContactCreatePayload) => void;
  isSubmitting: boolean;
}

export function ContactCreateForm({ onSubmit, isSubmitting }: ContactCreateFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      first_name: firstName,
      last_name: lastName || undefined,
      email,
      phone: phone || undefined,
      company: company || undefined,
      job_title: jobTitle || undefined,
      message: message || undefined,
      source: 'manual',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="space-y-2 col-span-2">
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
        <div className="space-y-2 col-span-2">
          <Label>Job Title</Label>
          <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Message / Notes</Label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Create Contact
        </Button>
      </div>
    </form>
  );
}
