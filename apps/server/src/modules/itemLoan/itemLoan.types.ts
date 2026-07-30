export interface CreateItemLoanDto {
  itemId: string;
  userId: string;
  quantity: number;
  dueDate: string | Date;
  notes?: string;
}

export interface UpdateItemLoanDto {
  status?: "DIPINJAM" | "DIKEMBALIKAN" | "HILANG" | "RUSAK";
  returnDate?: string | Date;
  notes?: string;
}

export interface ItemLoanQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userId?: string;
  itemId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ItemLoanResponseDto {
  id: string;
  item: {
    id: string;
    name: string;
    itemCode: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  quantity: number;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
