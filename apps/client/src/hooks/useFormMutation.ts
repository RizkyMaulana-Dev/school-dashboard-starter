import { useState, useCallback } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/api";

interface UseFormMutationOptions<TData, TVariables> {
  mutation: UseMutationResult<ApiResponse<TData>, Error, TVariables>;
  onSuccess?: (data: ApiResponse<TData>) => void;
  onError?: (error: Error) => void;
  resetOnSuccess?: boolean;
}

/**
 * Hook untuk menghubungkan form dengan mutation
 * Menyediakan state loading, error, dan handler submit
 */
export function useFormMutation<TData, TVariables>({
  mutation,
  onSuccess,
  onError,
  resetOnSuccess = true,
}: UseFormMutationOptions<TData, TVariables>) {
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (variables: TVariables) => {
      setFormError(null);

      try {
        const result = await mutation.mutateAsync(variables);
        onSuccess?.(result);

        if (resetOnSuccess) {
          setFormError(null);
        }

        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        setFormError(message);
        onError?.(error as Error);
        throw error;
      }
    },
    [mutation, onSuccess, onError, resetOnSuccess],
  );

  return {
    handleSubmit,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    formError: formError || (mutation.error instanceof Error ? mutation.error.message : null),
    mutation,
  };
}
