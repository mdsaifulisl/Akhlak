const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");

const createOrder = async (orderData) => {
  try {
    const { customer_name, email, phone, address, total, cart } = orderData;

    const orderId = uuidv4();

    const orderSql = `
      INSERT INTO orders (order_id, customer_name, email, phone, address, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await new Promise((resolve, reject) => {
      db.query(
        orderSql,
        [orderId, customer_name, email, phone, address, total],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    const itemSql = `
      INSERT INTO order_items (order_id, product_id, quantity, size)
      VALUES (?, ?, ?, ?)
    `;

    for (const item of cart) {
      await new Promise((resolve, reject) => {
        db.query(
          itemSql,
          [orderId, item.id, item.quantity, item.selectedSize || null],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    }

    return orderId;

  } catch (err) {
    console.error("❌ Error in createOrder:", err);
    throw err;
  }
};


// ✅ Get all orders with items
const getAllOrders = async () => {
  const sql = `
    SELECT o.*, i.product_id, i.quantity, i.size
    FROM orders o
    LEFT JOIN order_items i ON o.order_id = i.order_id
    ORDER BY o.created_at DESC
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);

      const grouped = results.reduce((acc, row) => {
        if (!acc[row.order_id]) {
          acc[row.order_id] = {
            order_id: row.order_id,
            customer_name: row.customer_name,
            email: row.email,
            phone: row.phone,
            address: row.address,
            total: row.total,
            status: row.status,
            created_at: row.created_at,
            items: [],
          };
        }

        if (row.product_id) {
          acc[row.order_id].items.push({
            product_id: row.product_id,
            quantity: row.quantity,
            size: row.size,
          });
        }

        return acc;
      }, {});

      resolve(Object.values(grouped));
    });
  });
};

// ✅ Get single order by ID
const getOrderById = async (orderId) => {
  const sql = `
    SELECT o.*, i.product_id, i.quantity, i.size
    FROM orders o
    LEFT JOIN order_items i ON o.order_id = i.order_id
    WHERE o.order_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [orderId], (err, results) => {
      if (err) return reject(err);
      if (!results.length) return resolve(null);

      const order = results.reduce((acc, row) => {
        if (!acc.order_id) {
          acc = {
            order_id: row.order_id,
            customer_name: row.customer_name,
            email: row.email,
            phone: row.phone,
            address: row.address,
            total: row.total,
            status: row.status,
            created_at: row.created_at,
            items: [],
          };
        }

        if (row.product_id) {
          acc.items.push({
            product_id: row.product_id,
            quantity: row.quantity,
            size: row.size,
          });
        }

        return acc;
      }, {});

      resolve(order);
    });
  });
};

// ✅ Update order status
const updateOrderStatus = async (orderId, status) => {
  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [status, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// ✅ models/orderModels.js
const deleteOrder = async (orderId) => {
  const sql = `DELETE FROM orders WHERE order_id = ?`;
  const deleteOrderItems = `DELETE FROM order_items WHERE order_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(deleteOrderItems, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    db.query(sql, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder };
