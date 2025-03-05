"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
// import { API_URL } from "../config";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage or server on initial load
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);

        if (isAuthenticated) {
          // If user is logged in, fetch cart from server
          const res = await axios.get(`http://localhost:5000/api/cart`);
          setCart(res.data.items);
        } else {
          // If user is not logged in, load cart from localStorage
          const localCart = localStorage.getItem("cart");
          if (localCart) {
            setCart(JSON.parse(localCart));
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // If user is logged in, add to server cart
        const res = await axios.post(`http://localhost:5000/api/cart`, {
          productId: product._id,
          quantity,
        });
        setCart(res.data.items);
      } else {
        // If user is not logged in, add to local cart
        const existingItem = cart.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          // If item already exists, update quantity
          setCart(
            cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          );
        } else {
          // If item doesn't exist, add it
          setCart([...cart, { product, quantity }]);
        }
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // If user is logged in, update server cart
        const res = await axios.put(`http://localhost:5000/api/cart/${productId}`, {
          quantity,
        });
        setCart(res.data.items);
      } else {
        // If user is not logged in, update local cart
        setCart(
          cart.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          )
        );
      }

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // If user is logged in, remove from server cart
        const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`);
        setCart(res.data.items);
      } else {
        // If user is not logged in, remove from local cart
        setCart(cart.filter((item) => item.product._id !== productId));
      }

      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove item from cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // If user is logged in, clear server cart
        await axios.delete(`http://localhost:5000/api/cart`);
      }

      // Clear local cart state
      setCart([]);
      localStorage.removeItem("cart");

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item || !item.product || !item.product.price) return total;
      return total + item.product.price * item.quantity;
    }, 0);
  };
  

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
