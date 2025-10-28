import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
// style
import "./assets/style/common.css";
import "./assets/style/all.css";

// components
import Header from "./components/header";
import Footer from "./components/Footer";

// pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import AddProduct from "./pages/AddProduct";
import Checkout from "./pages/Checkout";
import Details from "./pages/Details";
import OrderList from "./pages/OrderList";
import UpdateProduct from "./pages/updateProduct";
import OrderNow from "./pages/OrderNow";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Header />
      <div style={{ paddingTop: "5rem" }}></div>
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/details/:productId" element={<Details />} />
          <Route path="/update/:productId" element={<UpdateProduct />} />
          <Route path="/order-now/:productId" element={<OrderNow />} />
          {/* private route */}
          <Route path="/add-product" element={ <><PrivateRoute /> <AddProduct /></>} />
           <Route path="/order-list" element={ <><PrivateRoute /><OrderList /></>} />
        </Routes>
      </main>
      <Footer /> 
    </>
  );
}

export default App;
