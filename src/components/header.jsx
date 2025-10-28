import { useState, useEffect, useContext } from "react";
import HeaderCard from "./headerCards";
import Menu from "./Menu";
import Login from "./Login";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useAdminNotification } from "../context/AdminNotificationContext";
import { Link, useLocation } from "react-router-dom";
// style
import "../assets/style/header.css";
import "../assets/style/cart.css";

// img
import logo from "../assets/img/logo.png";
// icom
import { FaBars, FaUser } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";


// image


const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const location = useLocation();
   const { cart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
    const { hasNewOrder } = useAdminNotification();
  // Header Manu
  const [menu, setMenu] = useState(false);
  const [activeCart, setActiveCart] = useState(false);

  const handleMenu = () => {
    setMenu(!menu);
    setActiveCart(false);
    setLogin(false);
  };

  const toggleCart = () => {
    setActiveCart(!activeCart);
    setMenu(false);
    setLogin(false);
  };

  useEffect(() => {
    setMenu(false);
    setActiveCart(false);
    setLogin(false);
  }, [location.pathname]);

  useEffect(() => {
    const hendleScroll = () => {
      if (window.scrollY > 100) {
        setMenu(false);
        setActiveCart(false);
      }
    };
    window.addEventListener("scroll", hendleScroll);
    return () => {
      window.removeEventListener("scroll", hendleScroll);
    };
  }, []);

  const [login, setLogin] = useState(false);

  const handleLogin = () => {
    setLogin(!login);
    setMenu(false);
    setActiveCart(false);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header">
            {isLoggedIn && hasNewOrder && location.pathname !== "/order-list" && (
          <span className="text-danger position-absolute top-1 start-100 fs-5 none translate-middle" title="New Order"> <GoDotFill /> </span>
        )}
            <div className="header__logo">
              <Link to="/">
                {" "}
                <img src={logo} alt="Akhlak" />
              </Link>
            </div>

            {/* Menu */}
            <Menu menu={menu} handleLogin={handleLogin}/>
            

            {/* shop */}
            <div className="header__shop">
              <span onClick={toggleCart}>
                <GiShoppingCart /> {cart.length > 0 && <span className="nount">{cart.length}</span>}
              </span>

              {isLoggedIn ? (
                <span className="block" onClick={logout} title="Logout">
                  <RiLogoutBoxRLine />
                </span>
              ) : (
                <span className="block" onClick={handleLogin} title="Login">
                  <FaUser />
                </span>
              )}

              <span className="none" onClick={handleMenu}>
                
                <FaBars />
              </span>
            </div>

            {/*   header card start */}

            <HeaderCard
              products={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              activeCart={activeCart}
            />

            {/*  header card end */}
          </div>
        </div>

        <Login login={login} handleLogin={handleLogin} />
      </header>
    </>
  );
};

export default Header;
