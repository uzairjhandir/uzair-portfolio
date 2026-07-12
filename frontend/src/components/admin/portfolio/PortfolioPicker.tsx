'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePortfolioListQuery } from '@/lib/query/portfolio/queries';

interface PortfolioPickerProps {
  value: string | null;
  onChange: (uuid: string | null) => void;
  label?: string;
}

/** Reuses the existing Portfolio API (GET /portfolios) — no new endpoint, no hardcoded list. */
export function PortfolioPicker({ value, onChange, label = 'Related Portfolio' }: PortfolioPickerProps) {
  const { data, isLoading } = usePortfolioListQuery({ per_page: 100 });
  const projects = data?.data ?? [];

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <Select
        value={value ?? 'none'}
        onValueChange={(v) => onChange(v === 'none' ? null : v)}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Loading...' : 'None'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (standalone story)</SelectItem>
          {projects.map((p) => (
            <SelectItem key={p.uuid} value={p.uuid}>{p.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
