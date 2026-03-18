const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret"
    );

    const [rows] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = { protect };
