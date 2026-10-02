export interface CreateItemDto {
  categoryId: string;
  itemCode: string;
  name: string;
  stockTotal: number;
  stockAvailable: number;
  condition: "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";
  location?: string;
  purchaseDate?: string | Date;
}

export interface UpdateItemDto {
  categoryId?: string;
  itemCode?: string;
  name?: string;
  stockTotal?: number;
  stockAvailable?: number;
  condition?: "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";
  location?: string;
  purchaseDate?: string | Date;
}

export interface ItemQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  condition?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ItemResponseDto {
  id: string;
  itemCode: string;
  name: string;
  stockTotal: number;
  stockAvailable: number;
  condition: string;
  location: string | null;
  purchaseDate: Date | null;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
