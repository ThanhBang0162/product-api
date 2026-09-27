const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");

const app = express();

app.use(express.json());

// Trang kiểm tra API
app.get("/", (req, res) => {
  res.json({
    message: "Product API đang hoạt động"
  });
});

// Kiểm tra sức khỏe API và kết nối MongoDB
app.get("/health", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "error",
        mongodb: "disconnected"
      });
    }

    await mongoose.connection.db.admin().ping();

    return res.status(200).json({
      status: "ok",
      mongodb: "connected"
    });
  } catch {
    return res.status(503).json({
      status: "error",
      mongodb: "unavailable"
    });
  }
});

// Các chức năng CRUD sản phẩm
app.use("/api/products", productRoutes);

// Xử lý đường dẫn không tồn tại
app.use((req, res) => {
  res.status(404).json({
    message: "Đường dẫn không tồn tại"
  });
});

// Xử lý lỗi
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Mã sản phẩm đã tồn tại"
    });
  }

  if (
    err.name === "ValidationError" ||
    err.name === "CastError"
  ) {
    return res.status(400).json({
      message: err.message
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Dữ liệu JSON không hợp lệ"
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Lỗi máy chủ"
  });
});

module.exports = app;