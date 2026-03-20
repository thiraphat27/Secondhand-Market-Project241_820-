// หมวดหมู่สินค้า
const CATEGORY_LABELS = {
  1: "Electronics",
  2: "Fashion",
  3: "Home",
  4: "Sports",
  5: "Other",
};
// ใส่ประเภทสินค้า
export function normalizeCategoryId(rawValue) {
  return rawValue ? Number(rawValue) : null;
}
// แสดงประเภทสินค้า
export function getCategoryLabel(product) {
  if (product.category_name) {
    return product.category_name;
  }

  return CATEGORY_LABELS[Number(product.category_id)] || "-";
}