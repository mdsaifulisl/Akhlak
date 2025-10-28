import DtlImg from "../assets/img/panjabi.jpg";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../axios";

const Details = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    off: "",
    size: [],
    image: "",
    
  });

  const { addToCart, updateQuantity } = useContext(CartContext);

  // ✅ Size toggle handler
  const handleSelect = (size) => {
    setSelectedSize((prev) => (prev === size ? null : size));
  };

  // ✅ Load product by ID
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
            price: data.price || "",
            off: data.off || "",
            size: Array.isArray(data.size)
              ? data.size
              : JSON.parse(data.size || "[]"),
            image: data.image || "",
          });
        })
        .catch((err) => {
          console.error("Error loading product:", err);
        });
    }
  }, [productId]);

  // ✅ Quantity handler
  const handleQuantity = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    addToCart({ ...product, selectedSize, quantity });
    updateQuantity(product.id, selectedSize, quantity);
    setSelectedSize(null);
    setQuantity(1);
  };

  // ✅ Order now
  const handleOrderNow = () => {
    if (!selectedSize) {
      alert("Please select a size before ordering");
      return;
    }
    navigate(`/order-now/${product.id}`, { state: { selectedSize, quantity } });
  };

  return (
    <div className="details py-lg-5 py-1 my-5">
      <div className="container">
        <div className="row g-4">
          {/* Left: Product Image */}
          <div className="col-lg-6">
            <div className="details__img">
              <img
                src={product.image || DtlImg}
                alt={product.name}
                className="img-fluid rounded-3 w-100"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <div className="details__info px-lg-5 px-0">
              <h2>{product.name}</h2>
              <p className="fw-bold">Price: ৳{product.price}</p>

              {/* Size Select */}
              <div className="size d-flex gap-2 flex-wrap">
                {product.size.map((size) => (
                  <label
                    key={size}
                    htmlFor={size}
                    className={`border rounded px-3 py-1 ${
                      selectedSize === size
                        ? "bg-warning text-dark fw-bold"
                        : "bg-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      value={size}
                      id={size}
                      name="size"
                      checked={selectedSize === size}
                      onChange={() => handleSelect(size)}
                      hidden
                    />
                    {size}
                  </label>
                ))}
              </div>

              {/* Quantity */}
              <div className="quantity border rounded d-inline-flex align-items-center gap-3 mt-3 px-2 py-1 w-auto mx-auto">

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantity("decrease")}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span className="fw-normal fs-5">{quantity}</span>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantity("increase")}
                >
                  +
                </button>
              </div>

              {/* Buttons */}
              <div className="details__btn d-flex gap-2 mt-3">
                <button onClick={handleAddToCart} className="btn btn-warning">
                  Add to Cart
                </button>
                <button onClick={handleOrderNow} className="btn btn-primary">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;


/** প্রোডাক্ট আপ্লোড হওয়ার পরে এমন হয়
 * ["XXL"]
 * আপডেট করার পরে এমন হয়ে যাচ্ছে 
 * "[\"XXL\",\"XL\",\"L\"]"
 * 
 * 
 * 
 * 
 */
