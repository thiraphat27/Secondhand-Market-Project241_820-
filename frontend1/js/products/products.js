// สินค้าต่างๆ
import { getCategoryLabel, normalizeCategoryId } from "../categories/categories.js";
import { apiFetch } from "../core/api.js";
import { elements } from "../core/elements.js";
import { state } from "../core/state.js";
import { formatPrice, makeButton, showMessage } from "../core/ui.js";
import { handleSendMessage } from "../messages/messages.js";

// สร้างสินค้า
export async function handleCreateProduct(event) {
  event.preventDefault();

  if (!state.token) {
    showMessage(elements.productMessage, "Please login first", "error");
    return;
  }

  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        category_id: normalizeCategoryId(formData.get("category_id")),
      }),
    });

    form.reset();
    showMessage(elements.productMessage, "Product created", "success");
    await loadProducts(state.search);
  } catch (error) {
    showMessage(elements.productMessage, error.message, "error");
  }
}

// ช่องเอาไว้ค้นหา
export async function handleSearch(event) {
  event.preventDefault();
  state.search = elements.searchInput.value.trim();
  await loadProducts(state.search);
}

export async function loadProducts(keyword = "") {
  showMessage(elements.productsMessage, "Loading products...", "info");

  try {
    const endpoint = keyword ? `/products/search?q=${encodeURIComponent(keyword)}` : "/products";
    state.products = await apiFetch(endpoint);
    renderProducts(state.products);
    showMessage(elements.productsMessage, `Loaded ${state.products.length} product(s)`, "success");
  } catch (error) {
    renderProducts([]);
    showMessage(elements.productsMessage, error.message, "error");
  }
}

// แสดงสินค้า
export function renderProducts(products) {
  elements.productList.innerHTML = "";

  if (!products.length) {
    elements.productList.innerHTML = '<div class="muted">No products found.</div>';
    return;
  }

  products.forEach((product) => {
    const fragment = elements.productCardTemplate.content.cloneNode(true);
    fragment.querySelector(".product-title").textContent = product.title;
    fragment.querySelector(".product-price").textContent = formatPrice(product.price);
    fragment.querySelector(".product-description").textContent = product.description;
    fragment.querySelector(".product-meta").textContent =
      `Seller: ${product.username || "-"} | Category: ${getCategoryLabel(product)} | ID: ${product.id}`;

    const actions = fragment.querySelector(".product-actions");

    if (state.user && Number(state.user.id) === Number(product.user_id)) {
      const editButton = makeButton("แก้ไขสินค้า", "button secondary");
      editButton.addEventListener("click", () => handleEditProduct(product));
      actions.appendChild(editButton);

      const deleteButton = makeButton("ลบสินค้า", "button danger");
      deleteButton.addEventListener("click", () => handleDeleteProduct(product.id));
      actions.appendChild(deleteButton);
    } else {
      const messageButton = makeButton("ส่งข้อความ", "button secondary");
      messageButton.addEventListener("click", () => handleSendMessage(product));
      actions.appendChild(messageButton);
    }

    elements.productList.appendChild(fragment);
  });
}

// แก้ไขสินค้า
export async function handleEditProduct(product) {
  if (!state.token) {
    showMessage(elements.productsMessage, "Please login first", "error");
    return;
  }

  const title = window.prompt("Edit title", product.title);
  if (title === null) {
    return;
  }

  const description = window.prompt("Edit description", product.description);
  if (description === null) {
    return;
  }

  const price = window.prompt("Edit price", product.price);
  if (price === null) {
    return;
  }

  const categoryId = window.prompt(
    "Edit category ID (leave blank to remove)",
    product.category_id ?? ""
  );
  if (categoryId === null) {
    return;
  }

  try {
    await apiFetch(`/products/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category_id: normalizeCategoryId(categoryId),
      }),
    });

    showMessage(elements.productsMessage, "Product edited", "success");
    await loadProducts(state.search);
  } catch (error) {
    showMessage(elements.productsMessage, error.message, "error");
  }
}

// ลบสินค้า
export async function handleDeleteProduct(productId) {
  if (!state.token) {
    showMessage(elements.productsMessage, "Please login first", "error");
    return;
  }

  const confirmed = window.confirm(`Delete product #${productId}?`);
  if (!confirmed) {
    return;
  }

  try {
    await apiFetch(`/products/${productId}`, { method: "DELETE" });
    showMessage(elements.productsMessage, "Product deleted", "success");
    await loadProducts(state.search);
  } catch (error) {
    showMessage(elements.productsMessage, error.message, "error");
  }
}
