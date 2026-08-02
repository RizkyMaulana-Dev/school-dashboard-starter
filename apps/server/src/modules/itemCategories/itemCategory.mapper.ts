export function toItemCategoryResponse(category: any) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toItemCategoriesResponse(categories: any[]) {
  return categories.map(toItemCategoryResponse);
}