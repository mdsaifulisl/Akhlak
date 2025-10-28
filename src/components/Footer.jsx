import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Footer = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <footer className="pt-5 pb-2">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h4>AKHLAK</h4>
            <p>
              Your trusted fashion brand for trendy and affordable styles. We
              bring comfort, quality, and confidence in every outfit.
            </p>
          </div>
          <div className="col-lg-4 ">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/"> Home</Link>
              </li>
              <li>
                <Link to="/shop"> Shop</Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link to="/add-product"> Add Product</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="col-lg-4">
            <h4>Contact</h4>
            <p>
              <strong>Phone:</strong> +880 1511-760134
            </p>
            <p>
              <strong>Email:</strong> akhlakfashion56@gmail.com
            </p>
            <div className="social d-flex gap-2 my-2">
              <a target="_blank" className="facebook" href="https://www.facebook.com/share/1CuVffj2wf/">
                <FaFacebook />
              </a>
              <a target="_blank" className="instagram" href="https://www.facebook.com/share/1CuVffj2wf/">
                <FaInstagram />
              </a>
              <a target="_blank" className="tiktok" href="https://www.tiktok.com/@akhlakfashion?_t=ZS-90hTUufScRr&_r=1">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>

      <p className="text-center">
        &copy; {new Date().getFullYear()} AKHLAK. All rights reserved.
      </p>
    </footer>
  );
};
export default Footer;
