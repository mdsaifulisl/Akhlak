// CartContext.js
import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product.selectedSize) {
      alert("Please select a size first!");
      return;
    }

    const existing = cart.find(
      (item) =>
        item.id === product.id && item.selectedSize === product.selectedSize
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id, selectedSize) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.id === id && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (id, selectedSize, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id, selectedSize);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};


