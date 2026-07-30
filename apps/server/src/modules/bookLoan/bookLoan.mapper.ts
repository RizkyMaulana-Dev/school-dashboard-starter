export function toBookLoanResponse(loan: any) {
  return {
    id: loan.id,
    book: loan.book,
    user: loan.user,
    borrowDate: loan.borrowDate,
    dueDate: loan.dueDate,
    returnDate: loan.returnDate,
    fineAmount: loan.fineAmount,
    status: loan.status,
    notes: loan.notes,
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt,
  };
}

export function toBookLoansResponse(loans: any[]) {
  return loans.map(toBookLoanResponse);
}
