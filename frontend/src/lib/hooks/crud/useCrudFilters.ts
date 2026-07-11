import { useState, useCallback } from 'react';

export interface CrudFilters {
  page: number;
  per_page: number;
  search: string;
  sort_by: string;
  sort_dir: 'asc' | 'desc';
  [key: string]: unknown;
}

export const useCrudFilters = (initialFilters: Partial<CrudFilters> = {}) => {
  const [filters, setFilters] = useState<CrudFilters>({
    page: 1,
    per_page: 10,
    search: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
    ...initialFilters,
  });

  const updateFilter = useCallback((key: keyof CrudFilters, value: unknown) => {
    setFilters((prev) => {
      // If changing anything other than page, reset page to 1
      if (key !== 'page' && prev.page !== 1) {
        return { ...prev, [key]: value, page: 1 };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 10,
      search: '',
      sort_by: 'created_at',
      sort_dir: 'desc',
      ...initialFilters,
    });
  }, [initialFilters]);

  return { filters, updateFilter, resetFilters, setFilters };
};
