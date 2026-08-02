export interface CreateItemCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateItemCategoryDto {
  name?: string;
  description?: string;
}

export interface ItemCategoryQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ItemCategoryResponseDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}