import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaHome, FaShopify, FaUser } from "react-icons/fa";
import { MdOutlineAddShoppingCart, MdFolderCopy } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAdminNotification } from "../context/AdminNotificationContext";
import { GoDotFill } from "react-icons/go";

const Menu = ({ menu, handleLogin }) => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const location = useLocation();
  const { hasNewOrder } = useAdminNotification();

  return (
    <div className={menu ? "header__menu active" : "header__menu"}>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <FaHome /> Home
          </Link>
        </li>

        <li>
          <Link
            to="/shop"
            className={location.pathname === "/shop" ? "active" : ""}
          >
            <FaShopify /> Shop
          </Link>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <Link
                to="/add-product"
                className={location.pathname === "/add-product" ? "active" : ""}
              >
                <MdOutlineAddShoppingCart /> Add Product
              </Link>
            </li>
            <li className="position-relative">
              <Link
                to="/order-list"
                className={location.pathname === "/order-list" ? "active" : ""}
              >
                {hasNewOrder && location.pathname !== "/order-list" && (
                          <span className="text-danger position-absolute top-1 start-0 fs-5 block translate-middle" title="New Order"> <GoDotFill /> </span>
                        )}
                <MdFolderCopy /> Order List
              </Link>
            </li>
          </>
        )}

        {isLoggedIn ? (
          <li className="none logout" onClick={logout}>
            <RiLogoutBoxRLine /> Logout
          </li>
        ) : ( 
          <li className="none">
          <span onClick={handleLogin}>
            <FaUser /> Login
          </span>
            
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
