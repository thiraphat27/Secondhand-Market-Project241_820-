//กำหนดเส้นทางสำหรับการส่งข้อความระหว่างผู้ใช้และผู้ขาย
const express = require("express");
const messageController = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, messageController.sendMessage);
router.get("/product/:id", messageController.getMessagesByProduct);
router.get("/user/:id", protect, messageController.getMessagesByUser);

module.exports = router;
