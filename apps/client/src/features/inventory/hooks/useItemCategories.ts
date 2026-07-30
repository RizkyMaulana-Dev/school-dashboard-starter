import { useQuery } from "@tanstack/react-query";
import { itemService } from "@/services/item.service";

export function useItemCategories() {
  return useQuery({
    queryKey: ["item-categories"],
    queryFn: () => itemService.getAllCategories(),
  });
}
