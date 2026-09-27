const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Thêm sản phẩm
router.post("/", async (req, res) => {
  const { pid, pname, price, quantity } = req.body || {};

  const product = await Product.create({
    pid,
    pname,
    price,
    quantity
  });

  res.status(201).json(product);
});

// Xem danh sách sản phẩm
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ pid: 1 });
  res.json(products);
});

// Xem một sản phẩm theo mã pid
router.get("/:pid", async (req, res) => {
  const product = await Product.findOne({
    pid: req.params.pid
  });

  if (!product) {
    return res.status(404).json({
      message: "Không tìm thấy sản phẩm"
    });
  }

  res.json(product);
});

// Cập nhật tên, giá và số lượng; giữ nguyên mã pid
router.put("/:pid", async (req, res) => {
  const product = await Product.findOne({
    pid: req.params.pid
  });

  if (!product) {
    return res.status(404).json({
      message: "Không tìm thấy sản phẩm"
    });
  }

  const { pname, price, quantity } = req.body || {};

  product.pname = pname;
  product.price = price;
  product.quantity = quantity;

  await product.save();
  res.json(product);
});

// Xóa sản phẩm theo mã pid
router.delete("/:pid", async (req, res) => {
  const product = await Product.findOneAndDelete({
    pid: req.params.pid
  });

  if (!product) {
    return res.status(404).json({
      message: "Không tìm thấy sản phẩm"
    });
  }

  res.json({ message: "Đã xóa sản phẩm" });
});

module.exports = router;