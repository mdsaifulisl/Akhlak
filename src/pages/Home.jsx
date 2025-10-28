// data
import ProductCarts from "../components/ProductCarts";
import api from "../axios";
import { useNavigate } from "react-router-dom";
// icon
import { SiCashapp } from "react-icons/si";
import { TbTruckDelivery } from "react-icons/tb";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoCashOutline } from "react-icons/io5";
import { useState } from "react";
import { useEffect } from "react";
import herobg from "../assets/img/hero10.png";
import off from "../assets/img/off.png";
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    api
      .get("/api/products")
      .then((res) => {
        const latestProducts = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);

        setProducts(latestProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

 
  
  const deleteProduct = (id) => {
  api
    .delete(`/api/products/delete/${id}`)
    .then((res) => {
      console.log(res.data);
      setProducts(products.filter((product) => product.id !== id));
      
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
    });
};

// Fetch function
 const fetchProducts = () => {
  api
      .get("/api/products")
      .then((res) => {
        const latestProducts = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);

        setProducts(latestProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
};

useEffect(() => {
  fetchProducts();
}, []); 

  return (
    <>
      <div className="hero">
        <div className="hero_img">
          <img src={herobg} alt="Hero background" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h1>
                WELCOME TO <span>AKHLAK</span> FASHION
              </h1>
              <p>Show your personal style</p>
              <button onClick={() => navigate("/shop")} className="btn btn-warning mt-4">Order Now</button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5"></div>
      <div className="guranty py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="guranty-item text-center">
                <span>
                  <SiCashapp />
                </span>
                <h5>Money Back Guarantee</h5>
                <p>Shall open Divide a one</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="guranty-item">
                <span>
                  <TbTruckDelivery />
                </span>
                <h5>Home Delivery</h5>
                <p>On orders over $100</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="guranty-item">
                <span>
                  <TfiHeadphoneAlt />
                </span>
                <h5>Always Support</h5>
                <p>24/7 support available</p>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="guranty-item">
                <span>
                  <IoCashOutline />
                </span>
                <h5>Secure Payment</h5>
                <p>100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product__overview py-5">
        <div className="container">
          <h2 className="mb-5">
            <u>Product Overview</u>
          </h2>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ProductCarts products={products} deleteProduct={deleteProduct} />
          )}

          <div className="text-center">
            <button onClick={() => navigate("/shop")} className="btn btn-secondary mt-5 ">View More...</button>
          </div>
        </div>
      </div>

      <div className="container mb-5 overflow-hidden">
        <div className="off__section">
          <div className="row flex-row-reverse justify-content-center align-items-center  text-center">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h6 className="">ALL MEN'S COLLECTION</h6>
              <h1 className="text-white">50% OFF</h1>

              <button onClick={() => navigate("/shop")} className="btn btn-warning">Shop Now</button>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <img src={off} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
