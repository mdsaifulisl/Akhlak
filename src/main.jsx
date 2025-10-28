import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AdminNotificationProvider } from "./context/AdminNotificationContext";

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <AdminNotificationProvider>
          <App />
        </AdminNotificationProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
