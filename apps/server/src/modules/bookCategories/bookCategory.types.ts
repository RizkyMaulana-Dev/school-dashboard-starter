export interface CreateBookCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateBookCategoryDto {
  name?: string;
  description?: string;
}

export interface BookCategoryQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface BookCategoryResponseDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}