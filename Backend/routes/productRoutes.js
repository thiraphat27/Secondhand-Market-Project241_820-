//กำหนดเส้นทางสำหรับการจัดการสินค้า สร้าง แก้ไข ลบ และค้นหาสินค้า
const express = require("express");
const productController = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/category/:id", productController.getProductsByCategory);
router.get("/user/:id", productController.getProductsByUser);
router.get("/:id", productController.getProductById);

router.post("/", protect, productController.createProduct);
router.patch("/:id", protect, productController.editProduct);
router.put("/:id", protect, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);

module.exports = router;
