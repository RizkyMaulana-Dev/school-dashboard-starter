export function toBookCategoryResponse(category: any) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toBookCategoriesResponse(categories: any[]) {
  return categories.map(toBookCategoryResponse);
}