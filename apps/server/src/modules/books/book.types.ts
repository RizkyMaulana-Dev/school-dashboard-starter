export interface CreateBookDto {
  bookCategoryId: string;
  isbn?: string;
  title: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  stockTotal: number;
  stockAvailable: number;
  shelfLocation?: string;
  coverImage?: string;
}

export interface UpdateBookDto {
  bookCategoryId?: string;
  isbn?: string;
  title?: string;
  author?: string;
  publisher?: string;
  publishedYear?: number;
  stockTotal?: number;
  stockAvailable?: number;
  shelfLocation?: string;
  coverImage?: string;
}

export interface BookQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface BookResponseDto {
  id: string;
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  publishedYear: number | null;
  stockTotal: number;
  stockAvailable: number;
  shelfLocation: string | null;
  coverImage: string | null;
  category: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
