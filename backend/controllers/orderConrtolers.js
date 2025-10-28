
const { v4: uuidv4 } = require("uuid");
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../models/orderModels.js");

const createOrderController = async (req, res) => {
  try {
    const { customer_name, email, phone, address, total, cart } = req.body;
    console.log("Cart in controller:", cart);

    console.log("Order Data:", customer_name);

    if (!customer_name || !phone || !address || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const order_id = uuidv4();

    const orderData = {
      order_id,
      customer_name,
      email,
      phone,
      address,
      total,
      cart,
    };

    const result = await createOrder(orderData);

    res.status(201).json({
      message: "Order placed successfully",
      order_id,
      result,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({ orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get single order by ID
const getOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update order status
const updateOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const result = await updateOrderStatus(orderId, status);
    res.status(200).json({ message: "Order status updated", result });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete order
// ✅ controllers/orderController.js
const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("🗑️ Deleting Order ID:", orderId);

    const result = await deleteOrder(orderId);
    console.log("✅ Delete result:", result);

    res.status(200).json({ message: "Order deleted", result });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


module.exports = { createOrderController, getOrdersController, getOrderController, updateOrderController, deleteOrderController };
