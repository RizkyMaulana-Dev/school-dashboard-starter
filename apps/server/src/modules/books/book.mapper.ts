export function toBookResponse(book: any) {
  return {
    id: book.id,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publishedYear: book.publishedYear,
    stockTotal: book.stockTotal,
    stockAvailable: book.stockAvailable,
    shelfLocation: book.shelfLocation,
    coverImage: book.coverImage,
    category: book.category,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

export function toBooksResponse(books: any[]) {
  return books.map(toBookResponse);
}
