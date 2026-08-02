import apiClient from './api-client';
import type { ItemCategory } from '@/types/entities';
import type { ApiResponse, PaginatedResponse, QueryParams } from '@/types/api';

const ENDPOINT = '/item-category';

export const itemCategoryService = {
  async getAll(params?: QueryParams): Promise<PaginatedResponse<ItemCategory>> {
    return apiClient.get(ENDPOINT, { params });
  },
  async getById(id: string): Promise<ApiResponse<ItemCategory>> {
    return apiClient.get(`${ENDPOINT}/${id}`);
  },
  async create(data: { name: string; description?: string }): Promise<ApiResponse<ItemCategory>> {
    return apiClient.post(ENDPOINT, data);
  },
  async update(id: string, data: { name?: string; description?: string }): Promise<ApiResponse<ItemCategory>> {
    return apiClient.patch(`${ENDPOINT}/${id}`, data);
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`${ENDPOINT}/${id}`);
  },
};