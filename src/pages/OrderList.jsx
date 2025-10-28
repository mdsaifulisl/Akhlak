/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAdminNotification } from "../context/AdminNotificationContext";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeStatusId, setActiveStatusId] = useState(null);

const { clearNotification } = useAdminNotification();

const handleStatusClick = (orderId) => {
  setActiveStatusId((prev) => (prev === orderId ? null : orderId));
};


  useEffect(() => {
    fetchOrdersAndProducts();
    clearNotification();
  }, [clearNotification]);

  // 🧾 Fetch orders and products together
  const fetchOrdersAndProducts = async () => {
    try {
      const ordersRes = await api.get("/api/orders");
      const ordersData = ordersRes.data.orders;

      const productsRes = await api.get("/api/products");
      const productsData = productsRes.data;

      // Merge products into orders
      const mergedOrders = ordersData.map((order) => {
        const itemsWithProduct = order.items.map((item) => {
          const product = productsData.find((p) => p.id === item.product_id);
          return { ...item, product };
        });
        return { ...order, items: itemsWithProduct };
      });

      setOrders(mergedOrders);
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const statusOrder = ["Processing", "Pending", "Delivered"];

  // ✅ Toggle order status (with backend update)
  const toggleStatus = async (orderId) => {
    const order = orders.find((o) => o.order_id === orderId);
    if (!order) return;

    const currentIndex = statusOrder.indexOf(order.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      await api.put(`/api/orders/${orderId}`, { status: nextStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, status: nextStatus } : o
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status!");
    }
  };

  // ✅ Cancel/Delete Order (with backend delete)
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/api/orders/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order!");
    }
  };

  // Print order details
  const printOrder = (order) => {
    const printContent = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Order Details</h2>
        <h4>Akhlak</h4>
        <h5>Cash on delivery.</h5>
        <p><b>Order ID:</b> ${order.order_id}</p>
        <p><b>Customer:</b> ${order.customer_name}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Email:</b> ${order.email}</p>
        <p><b>Address:</b> ${order.address}</p>
        <p><b>Date:</b> ${new Date(order.created_at).toLocaleString()}</p>
        <p><b>Total:</b> ৳${order.total}</p>
        <p><b>Status:</b> ${order.status}</p>
        <h4>Items:</h4>
        <ol>
          ${order.items
            .map(
              (item) =>
                `<li>${item.product?.name || "Unknown"} - <strong>Size:</strong> ${
                  item.size
                }, <strong>Qty:</strong> ${item.quantity}</li>`
            )
            .join("")}
        </ol>
      </div>
    `;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  };

  return (
    <div className="order-container">
      <h2>🧾 Order List</h2>
      <div className="table-responsive">
        <table className="order-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total (৳)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.order_id}>
                  <td>{index + 1}</td>
                  <td>
                    <small>
                      {order.customer_name} <br />
                      {order.phone} <br />
                      {order.email && <div>{order.email}</div>}
                      <div className="span">{order.address}</div>
                      <div>{new Date(order.created_at).toLocaleString()}</div>
                    </small>
                  </td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item.product_id}>
                        {item.product?.name || "Unknown"} - Size: {item.size},
                        Qty: {item.quantity}
                      </div>
                    ))}
                  </td> 
                  <td>{order.total}</td>
                  <td className="position-relative">
                    <span
                      className={`status ${order.status.toLowerCase()}`}
                      style={{
                        cursor:
                          order.status === "Delivered"
                            ? "not-allowed"
                            : "pointer",
                        opacity: order.status === "Delivered" ? 0.6 : 1,
                      }}
                      onClick={() => {
                        if (order.status !== "Delivered") {
                          toggleStatus(order.order_id);
                        }
                      }}
                    >
                      {order.status}
                    </span>

                    {/* শুধু যদি Delivered হয়, তাহলে 3-dot মেনু দেখাবে */}
                    {order.status === "Delivered" && (
                      <span className="position-absolute top-0 end-0 d-flex flex-column align-items-end gap-2">
                        <span
                          onClick={() => handleStatusClick(order.order_id)}
                          className="visually float-end cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          <BsThreeDotsVertical />
                        </span>

                        {/* শুধু এই order টিই active হলে dropdown দেখাবে */}
                       
                        {activeStatusId === order.order_id && (
                          <span
                            onClick={() => toggleStatus(order.order_id)}
                            className="stutas active"
                          >
                            <small>Processing</small>
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn-cancel"
                      onClick={() => cancelOrder(order.order_id)}
                    >
                      Cancel
                    </button>
                    <br />
                    <button
                      className="btn-print mt-2"
                      onClick={() => printOrder(order)}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
