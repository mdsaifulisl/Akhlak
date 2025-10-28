import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAdminNotification } from "../context/AdminNotificationContext";

import api from "../axios";

const OrderNow = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showNewOrderNotification } = useAdminNotification();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [product, setProduct] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { selectedSize, quantity } = location.state || {};

  useEffect(() => {
    if (productId) {
      api
        .get(`/api/products/${productId}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          if (!data) return;

          setProduct({
            id: data.id || "",
            name: data.name || "",
            price: Number(data.price) || 0,
            off: data.off || "",
            size: Array.isArray(data.size)
              ? data.size
              : JSON.parse(data.size || "[]"),
            image: data.image || "",
            quantity: quantity || 1, // ✅ default 1 quantity
          });
        })
        .catch((err) => {
          console.error("Error loading product:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [productId, quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e) => {
    setDeliveryCharge(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    if (!deliveryCharge) {
      alert("অনুগ্রহ করে ডেলিভারি চার্জ নির্বাচন করুন");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      selectedSize: selectedSize,
    };

    const orderData = {
      customer_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      total,
      cart: [cartItem], 
    };
    try {
      const res = await api.post("/api/orders", orderData);
      console.log("✅ Order Response:", res.data);
      setMessage("✅ আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      showNewOrderNotification();
      navigate("/");
    } catch (err) {
      console.error("❌ অর্ডার দিতে সমস্যা:", err);
      alert("অর্ডার দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setDeliveryCharge(0);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center my-5 text-danger">Product not found!</div>
    );
  }

  const subtotal = product.price * product.quantity;
  const total = subtotal + deliveryCharge;

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
                  <label htmlFor="outofDhaka">
                    ঢাকার বাহিরে ডেলিভারি চার্জ
                  </label>
                  <span>৳130</span>
                </div>
              </div>

              <button type="submit" className="btn btn-warning w-100 mt-2">
                অর্ডার প্রদান করুন
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

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  {product.name.length > 20
                    ? product.name.slice(0, 20) + "..."
                    : product.name}{" "}
                  × {product.quantity} ({selectedSize || "—"})
                </span>
                <span>৳{product.price * product.quantity}</span>
              </li>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNow;

