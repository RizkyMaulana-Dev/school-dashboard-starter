export interface CreateBookLoanDto {
  bookId: string;
  userId: string;
  dueDate: string | Date;
  notes?: string;
}

export interface UpdateBookLoanDto {
  status?: "DIPINJAM" | "DIKEMBALIKAN" | "TERLAMBAT" | "HILANG";
  returnDate?: string | Date;
  dueDate?: string | Date;
  fineAmount?: number;
  notes?: string;
}

export interface BookLoanQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  bookId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface BookLoanResponseDto {
  id: string;
  book: {
    id: string;
    title: string;
    isbn: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  fineAmount: number | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
