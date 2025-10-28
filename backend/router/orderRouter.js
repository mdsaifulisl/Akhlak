const express = require("express");
const { createOrderController, getOrdersController, getOrderController, updateOrderController, deleteOrderController } = require("../controllers/orderConrtolers");

const router = express.Router();

// POST /api/orders
router.post("/", createOrderController);

// GET /api/orders
router.get("/", getOrdersController);

// GET /api/orders/:orderId
router.get("/:orderId", getOrderController);

// PUT /api/orders/:orderId
router.put("/:orderId", updateOrderController);

// DELETE /api/orders/:orderId
router.delete("/:orderId", deleteOrderController);

module.exports = router;
