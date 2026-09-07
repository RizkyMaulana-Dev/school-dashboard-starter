import { useQuery } from '@tanstack/react-query';
import { itemCategoryService } from '@/services/itemCategory.service';
import type { QueryParams } from '@/types/api';

export function useItemCategories(params?: QueryParams) {
  return useQuery({
    queryKey: ['item-categories', params],
    queryFn: () => itemCategoryService.getAll(params),
  });
}

export function useItemCategoryDetail(id?: string) {
  return useQuery({
    queryKey: ['item-categories', id],
    queryFn: () => itemCategoryService.getById(id!),
    enabled: !!id,
  });
}