
import ProductCarts from "../components/ProductCarts";
import { useEffect, useState } from "react";
import api from "../axios";
const Shop = () => {
    const [products, setProducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    useEffect(() => {
        fetchProducts();
        api.get("/api/products")
        .then((res) => {
            const latestProducts = res.data
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 4);
    
            setProducts(latestProducts);
            setLoading(false);            
          })
          .catch((err) => {
            console.error("Error fetching products:", err);
            setLoading(false);
          });
      }, []);
      const deleteProduct = (id) => {
        api
          .delete(`/api/products/delete/${id}`)
          .then((res) => {
            console.log(res.data);
            setProducts(products.filter((product) => product.id !== id));
            setLoading(false);            
          })
          .catch((err) => {
            console.error("Error deleting product:", err);
            setLoading(false);
          });
      };
      const fetchProducts = () => {
        api.get("/api/products")
        .then((res) => {
          setProducts(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          setLoading(false);
        });
      };
      useEffect(() => {
        fetchProducts();
      }, []);
    return (
        <>
       
        <div className="product__overview py-5">
        <div className="container">
          <h2 className="mb-5">
            <u>Shop All Products</u>
          </h2>
          {Loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ProductCarts products={products} deleteProduct={deleteProduct}/>
          )}
          
        </div>
      </div>
        
        </>
    );
};
export default Shop;
