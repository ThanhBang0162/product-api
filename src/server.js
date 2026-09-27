require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const Product = require("./models/Product");

async function startServer() {
  const port = Number(process.env.PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT trong .env không hợp lệ");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Thiếu MONGO_URI trong .env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });

  // Chờ tạo chỉ mục duy nhất cho mã sản phẩm
  await Product.init();

  console.log("Đã kết nối MongoDB");

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Product API chạy tại http://localhost:${port}`);
  });

  server.on("error", (err) => {
    console.error("Không thể mở cổng API:", err.message);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error("Khởi động thất bại:", err.message);
  process.exit(1);
});
