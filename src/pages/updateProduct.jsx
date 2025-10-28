import { useState, useRef, useEffect } from "react";
import api from "../axios"; 
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
    const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    off: "",
    size: [],
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);
  const { productId } = useParams();
  
  
  // ✅ প্রথমে পুরনো product data আনো
  useEffect(() => {
  if (productId) {
    api
      .get(`/api/products/${productId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data; 
        if (!data) return;

        setProduct({
          name: data.name || "",
          price: data.price || "",
          off: data.off || "",
          size: Array.isArray(data.size)
            ? data.size
            : JSON.parse(data.size || "[]"),
          image: null,
        });
        setPreview(data.image || null);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
      });
  }
}, [productId]);

  console.log(product);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

 
  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      size: checked
        ? [...prev.size, value]
        : prev.size.filter((s) => s !== value),
    }));
  }; 

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.size.length) {
      alert("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("off", product.off || 0);
    formData.append("size", JSON.stringify(product.size));
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const res = await api.put(`/api/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Product updated successfully!");
      console.log("Update Response:", res.data);
    } catch (err) {
      console.error("❌ Error updating product:", err);
      setMessage("❌ Failed to update product");
    }
    navigate("/");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="add-product container mt-5 mb-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Update Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Price (৳)</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Discount (%)</label>
            <input
              type="number"
              name="off"
              className="form-control"
              value={product.off}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>

          <div className="col-12">
            <label className="form-label d-block mb-2">Available Sizes</label>
            <div className="d-flex gap-2 flex-wrap">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    id={size}
                    value={size}
                    className="form-check-input"
                    onChange={handleSizeChange}
                    checked={product.size.includes(size)}
                  />
                  <label htmlFor={size} className="form-check-label">
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-warning px-4">
              Update Product
            </button>
          </div>
        </div>
      </form>

      {message && (
        <p className="text-center mt-4 text-success fw-semibold">{message}</p>
      )}

      {preview && (
        <div className="preview text-center mt-4">
          <img
            src={preview}
            alt="Preview"
            className="img-fluid rounded shadow-sm"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
