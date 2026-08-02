import { useMutation, useQueryClient } from '@tanstack/react-query';
import { itemCategoryService } from '@/services/item-category.service';
import { useUIStore } from '@/stores/ui.store';

export function useCreateItemCategory() {
  const qc = useQueryClient();
  const addToast = useUIStore(s => s.addToast);
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => itemCategoryService.create(data),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['item-categories'] });
      addToast({ type: 'success', title: 'Kategori dibuat', message: res.message });
    },
    onError: (err: Error) => addToast({ type: 'error', title: 'Gagal', message: err.message }),
  });
}

export function useUpdateItemCategory() {
  const qc = useQueryClient();
  const addToast = useUIStore(s => s.addToast);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      itemCategoryService.update(id, data),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['item-categories'] });
      addToast({ type: 'success', title: 'Kategori diperbarui', message: res.message });
    },
    onError: (err: Error) => addToast({ type: 'error', title: 'Gagal', message: err.message }),
  });
}

export function useDeleteItemCategory() {
  const qc = useQueryClient();
  const addToast = useUIStore(s => s.addToast);
  return useMutation({
    mutationFn: (id: string) => itemCategoryService.delete(id),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['item-categories'] });
      addToast({ type: 'success', title: 'Kategori dihapus', message: res.message });
    },
    onError: (err: Error) => addToast({ type: 'error', title: 'Gagal', message: err.message }),
  });
}