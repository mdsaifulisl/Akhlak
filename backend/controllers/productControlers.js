const fs = require("fs");
const path = require("path");
const Product = require("../models/productModels");

// Get all products
exports.getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  Product.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length)
      return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
};

// Create product
exports.createProduct = (req, res) => {
  const { name, price, off, size } = req.body;
  let image = null;
  if (req.file) {
     image = `http://localhost:5000/uploads/${req.file.filename}`;
    // image = `https://akhlak.backend.reliablekrishi.com/uploads/${req.file.filename}`;
  }

  if (!name || !price || !size || !image) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  Product.create({ name, price, off, size, image }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(result);
  });
};

// Update product
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, price, off, size } = req.body;

  let parsedSize = [];
  if (Array.isArray(size)) {
    parsedSize = size;
  } else if (typeof size === "string") {
    try {
      parsedSize = JSON.parse(size);
    } catch {
      parsedSize = size.split(",").map((s) => s.trim());
    }
  }

  Product.getById(id, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product || product.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const oldProduct = product[0];

    let newImagePath = oldProduct.image;
    if (req.file) {
      newImagePath = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      if (oldProduct.image) {
        const oldFileName = path.basename(oldProduct.image);
        const oldFilePath = path.join(__dirname, "..", "uploads", oldFileName);

        fs.unlink(oldFilePath, (err) => {
          if (err) console.error("⚠️ Failed to delete old image:", err.message);
        });
      }
    }

    const updatedData = {
      name,
      price,
      off: off ? Number(off) : 0,
      size: parsedSize, 
      image: newImagePath,
    };

    Product.update(id, updatedData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "Product updated successfully",
        updatedProduct: {
          id,
          ...updatedData,
          size: parsedSize,
        },
      });
    });
  });
};

// Delete product
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  Product.getById(id, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product || product.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const prod = product[0];

    if (prod.image) {
      const fileName = path.basename(prod.image);
      const fullPath = path.join(__dirname, "..", "uploads", fileName);

      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting image file:", err);
        else console.log("Image deleted successfully");
      });
    }

    Product.delete(id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Product and image deleted successfully" });
    });
  });
};

