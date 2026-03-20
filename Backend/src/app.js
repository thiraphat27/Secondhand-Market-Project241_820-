const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("../routes/authRoutes");
const productRoutes = require("../routes/productRoutes");
const messageRoutes = require("../routes/messageRoutes");
const { notFound, errorHandler } = require("../middleware/errorMiddleware");

const app = express();
const frontend1Path = path.resolve(__dirname, "../../frontend1");

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);
app.use(express.json());
app.use("/frontend1", express.static(frontend1Path));

app.get("/", (req, res) => {
  res.json({
    message: "Secondhand Marketplace API",
    status: "ok",
  });
});

app.get("/frontend1", (req, res) => {
  res.sendFile(path.join(frontend1Path, "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
