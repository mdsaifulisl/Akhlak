import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCarts = ({ products, deleteProduct }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="row g-2 g-lg-4">
      {products.map((product) => (
        <div className="col-lg-3 col-6" key={product.id}>
          <div className="card h-100">
            {product.off ? <div className="off">{product.off}% off</div> : null}
            <img
              className="card-img-top"
              src={product.image}
              alt={product.name}
            />

            <div className="card-body">
              <h6 className="card-title">{product.name.length > 25 ? product.name.slice(0, 25) + "..." : product.name}</h6>
              <p>৳ {product.price}</p>

              

              <div className="cart-btn mt-3 d-flex flex-column gap-2">
                <button onClick={() => navigate(`/details/${product.id}`)} className="btn btn-warning">Buy Now</button>
                {isLoggedIn ? (
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "আপনি কি সত্যিই এই প্রোডাক্টটি ডিলিট করতে চান?"
                        );
                        if (confirmDelete) {
                          deleteProduct(product.id);
                        }
                      }}
                    >
                      Delete
                    </button>

                    <button className="btn btn-primary" onClick={() => navigate(`/update/${product.id}`)}>Update</button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCarts;
