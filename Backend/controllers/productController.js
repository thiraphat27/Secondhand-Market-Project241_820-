//ProductController สำหรับจัดการสินค้า สร้าง แก้ไข ลบ และค้นหาสินค้า

const db = require("../config/db");

//CREATE
exports.createProduct = async (req, res) => {
  const { title, description, price, category_id = null } = req.body;

  if (!title || !description || price === undefined || price === null || price === "") {
    return res.status(400).json({
      message: "title, description, and price are required",
    });
  }

  try {
    const [result] = await db.query(
      `
        INSERT INTO products (title, description, price, category_id, user_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      [title, description, price, category_id, req.user.id]
    );

    const [rows] = await db.query(
      `
        SELECT
          products.*,
          users.username,
          categories.name AS category_name
        FROM products
        LEFT JOIN users ON products.user_id = users.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.id = ?
        LIMIT 1
      `,
      [result.insertId]
    );

    return res.status(201).json({
      message: "Product created",
      product: rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        products.*,
        users.username,
        categories.name AS category_name
      FROM products
      LEFT JOIN users ON products.user_id = users.id
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.created_at DESC, products.id DESC
    `);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          products.*,
          users.username,
          categories.name AS category_name
        FROM products
        LEFT JOIN users ON products.user_id = users.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          products.*,
          users.username,
          categories.name AS category_name
        FROM products
        LEFT JOIN users ON products.user_id = users.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.category_id = ?
        ORDER BY products.created_at DESC, products.id DESC
      `,
      [id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//GET PRODUCTS BY USER
exports.getProductsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          products.*,
          categories.name AS category_name
        FROM products
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.user_id = ?
        ORDER BY products.created_at DESC, products.id DESC
      `,
      [id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//SEARCH PRODUCTS
exports.searchProducts = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const search = `%${q}%`;

    const [rows] = await db.query(
      `
        SELECT
          products.*,
          users.username,
          categories.name AS category_name
        FROM products
        LEFT JOIN users ON products.user_id = users.id
        LEFT JOIN categories ON products.category_id = categories.id
        WHERE products.title LIKE ? OR products.description LIKE ?
        ORDER BY products.created_at DESC, products.id DESC
      `,
      [search, search]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//UPDATE
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category_id = null } = req.body;

  if (!title || !description || price === undefined || price === null || price === "") {
    return res.status(400).json({
      message: "title, description, and price are required",
    });
  }

  try {
    const [products] = await db.query(
      "SELECT id, user_id, category_id FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (Number(products[0].user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "You can only update your own products",
      });
    }

    await db.query(
      `
        UPDATE products
        SET title = ?, description = ?, price = ?, category_id = ?
        WHERE id = ?
      `,
      [title, description, price, category_id, id]
    );

    return res.json({
      message: "Product updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//EDIT PRODUCT (PATCH)
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category_id } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      price === undefined &&
      category_id === undefined
    ) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const [products] = await db.query(
      "SELECT id, user_id FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (Number(products[0].user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "You can only edit your own products",
      });
    }

    await db.query(
      `
        UPDATE products
        SET
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          category_id = ?
        WHERE id = ?
      `,
      [
        title === undefined ? null : String(title).trim(),
        description === undefined ? null : String(description).trim(),
        price === undefined ? null : Number(price),
        category_id === undefined ? products[0].category_id : category_id === "" ? null : category_id,
        id,
      ]
    );

    return res.json({
      message: "Product edited",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      "SELECT id, user_id FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (Number(products[0].user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        message: "You can only delete your own products",
      });
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    return res.json({
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
