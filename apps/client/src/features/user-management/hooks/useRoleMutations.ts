import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/role.service";
import { useUIStore } from "@/stores/ui.store";

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);
  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      addToast({ type: "success", title: "Role dihapus" });
    },
    onError: (error) => addToast({ type: "error", title: "Gagal", message: error.message }),
  });
}
