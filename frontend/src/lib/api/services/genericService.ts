import { apiClient } from '../client';
import { Resources, ResourceKey } from '../resources';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

export function createGenericService<T>(resourceKey: ResourceKey) {
  const resourceDef = Resources[resourceKey];
  if (!resourceDef) {
    throw new Error(`Resource ${resourceKey} not found in configuration.`);
  }

  const endpoint = resourceDef.endpoint || `/${resourceDef.resource}`;

  return {
    getList: async (filters?: Record<string, unknown>): Promise<PaginatedResponse<T>> => {
      const response = await apiClient.get(endpoint, { params: filters });
      return response.data;
    },
    
    getById: async (id: string | number): Promise<{ data: T }> => {
      const response = await apiClient.get(`${endpoint}/${id}`);
      return response.data;
    },

    create: async (data: Partial<T>): Promise<{ data: T }> => {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    },

    update: async (id: string | number, data: Partial<T>): Promise<{ data: T }> => {
      const response = await apiClient.put(`${endpoint}/${id}`, data);
      return response.data;
    },

    delete: async (id: string | number): Promise<void> => {
      await apiClient.delete(`${endpoint}/${id}`);
    },

    bulkAction: async (action: string, ids: (string | number)[]): Promise<void> => {
      await apiClient.post(`${endpoint}/bulk`, { action, ids });
    }
  };
}
