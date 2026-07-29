export function toItemLoanResponse(loan: any) {
  return {
    id: loan.id,
    item: loan.item,
    user: loan.user,
    quantity: loan.quantity,
    borrowDate: loan.borrowDate,
    dueDate: loan.dueDate,
    returnDate: loan.returnDate,
    status: loan.status,
    notes: loan.notes,
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt,
  };
}

export function toItemLoansResponse(loans: any[]) {
  return loans.map(toItemLoanResponse);
}