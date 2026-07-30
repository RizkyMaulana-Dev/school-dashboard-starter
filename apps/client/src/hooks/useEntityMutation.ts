import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";
import { useUIStore } from "@/stores/ui.store";

interface MutationConfig<TData, TVariables> {
  entityKey: string;
  onSuccessMessage?: string;
  onErrorMessage?: string;
  mutationOptions?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, "mutationFn">;
}

/**
 * Generic hook factory untuk mutation (create/update/delete)
 */
export function createEntityMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  config: MutationConfig<TData, TVariables>,
) {
  return function useEntityMutation() {
    const queryClient = useQueryClient();
    const addToast = useUIStore((state) => state.addToast);

    return useMutation<ApiResponse<TData>, Error, TVariables>({
      mutationFn,
      onSuccess: (data) => {
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: [config.entityKey] });

        // Show success toast
        if (config.onSuccessMessage || data.message) {
          addToast({
            type: "success",
            title: "Success",
            message: config.onSuccessMessage || data.message,
          });
        }
      },
      onError: (error) => {
        // Show error toast
        addToast({
          type: "error",
          title: "Error",
          message: config.onErrorMessage || error.message || "An error occurred",
          duration: 8000,
        });
      },
      ...config.mutationOptions,
    });
  };
}

/**
 * Generic hook untuk delete mutation
 */
export function useDeleteEntity<TData>(
  entityKey: string,
  deleteFn: (id: string) => Promise<ApiResponse<TData>>,
  onSuccessMessage?: string,
) {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation<ApiResponse<TData>, Error, string>({
    mutationFn: (id: string) => deleteFn(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [entityKey] });

      addToast({
        type: "success",
        title: "Deleted",
        message: onSuccessMessage || data.message || "Item deleted successfully",
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to delete item",
        duration: 8000,
      });
    },
  });
}
