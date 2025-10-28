const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControlers");
const upload = require("../utils/multer");

 

// Routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", upload.single("image"), productController.createProduct);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;

