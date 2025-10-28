import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAdminNotification } from "../context/AdminNotificationContext";
import api from "../axios";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  console.log("Cart before sending:", cart);

  const { showNewOrderNotification } = useAdminNotification();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e) => {
    setDeliveryCharge(Number(e.target.value));
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + deliveryCharge;

  // 🧾 Handle Order Submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  

  if (!deliveryCharge) {
    alert("অনুগ্রহ করে ডেলিভারি চার্জ নির্বাচন করুন");
    return;
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + deliveryCharge;

  const orderData = {
    customer_name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    total,
    cart,
  };
  console.log("Order Data:", cart);

  try {
    const res = await api.post("/api/orders", orderData);
    console.log("✅ Order Response:", res.data);
    setMessage("✅ আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
    showNewOrderNotification();
    clearCart();
    navigate("/");
  } catch (err) {
    console.error("❌ অর্ডার দিতে সমস্যা:", err);
    alert("অর্ডার দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Checkout</h2>

      <div className="row g-4">
        {/* Left side: Customer form */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Billing Information</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">আপনার পুর নাম লিখুন <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">আপনার ইমেইল লিখুন <small>(অপশনাল)</small></label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">আপনার ফোন নম্বর লিখুন <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">আপনার ঠিকানা লিখুন <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="outofDhaka mb-3">
                <div className="dhaka">
                  <input
                    type="radio"
                    name="delivery"
                    id="dhaka"
                    value="70"
                    checked={deliveryCharge === 70}
                    onChange={handleDeliveryChange}
                  />
                  <label htmlFor="dhaka">ঢাকার মধ্যে ডেলিভারি চার্জ</label>
                  <span>৳70</span>
                </div>
                <div className="dhaka">
                  <input
                    type="radio"
                    name="delivery"
                    id="outofDhaka"
                    value="130"
                    checked={deliveryCharge === 130}
                    onChange={handleDeliveryChange}
                  />
                  <label htmlFor="outofDhaka">ঢাকার বাহিরে ডেলিভারি চার্জ</label>
                  <span>৳130</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 mt-2"
                disabled={loading}
              >
                {loading ? "Processing..." : "অর্ডার প্রদান করুন"}
              </button>
            </form>

            {message && (
              <p className="text-success text-center mt-3 fw-semibold">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Right side: Order summary */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Order Summary</h5>
            {cart.length === 0 ? (
              <p className="text-center text-muted">🛒 আপনার কার্ট খালি</p>
            ) : (
              <ul className="list-group mb-3">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.name.length > 20
                        ? item.name.slice(0, 20) + "..."
                        : item.name}{" "}
                      × {item.quantity} ({item.selectedSize || "—"})
                    </span>
                    <span>৳{item.price * item.quantity}</span>
                  </li>
                ))}

                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Subtotal <span>৳{subtotal}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Delivery Charge <span>৳{deliveryCharge}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
                  Total <span>৳{total}</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
