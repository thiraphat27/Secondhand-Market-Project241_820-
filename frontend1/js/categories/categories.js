const CATEGORY_LABELS = {
  1: "Electronics",
  2: "Fashion",
  3: "Home",
  4: "Sports",
  5: "Other",
};

export function normalizeCategoryId(rawValue) {
  return rawValue ? Number(rawValue) : null;
}

export function getCategoryLabel(product) {
  if (product.category_name) {
    return product.category_name;
  }

  return CATEGORY_LABELS[Number(product.category_id)] || "-";
}
