export function toItemResponse(item: any) {
  return {
    id: item.id,
    itemCode: item.itemCode,
    name: item.name,
    stockTotal: item.stockTotal,
    stockAvailable: item.stockAvailable,
    condition: item.condition,
    location: item.location,
    purchaseDate: item.purchaseDate,
    category: item.category,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function toItemsResponse(items: any[]) {
  return items.map(toItemResponse);
}
