import { useState, useRef } from "react";
import api from "../axios";

const AddProduct = () => {
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

    // Validation check
    if (
      !product.name ||
      !product.price ||
      !product.size.length ||
      !product.image
    ) {
      alert("Please fill all the fields");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("off", product.off);
    formData.append("image", product.image);
    formData.append("size", JSON.stringify(product.size));

    try {
      const response = await api.post(
        "/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        } 
      );

      console.log("✅ Server Response:", response.data);
      setMessage("✅ Product added successfully!");

      setProduct({ name: "", price: "", off: "", size: [], image: null });
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("❌ Error uploading product:", error);
      setMessage("❌ Failed to upload product. Please try again!");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="add-product container mt-5 mb-5 p-4 shadow rounded bg-light">
      <h2 className="text-center mb-4">Add New Product</h2>

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
              placeholder="Enter product name"
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
              placeholder="Enter price"
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
              placeholder="Enter discount (optional)"
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
              Add Product
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
          />
        </div>
      )}
    </div>
  );
};

export default AddProduct;
