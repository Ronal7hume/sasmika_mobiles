'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('sasmika_cart');
      const storedFavs = localStorage.getItem('sasmika_favorites');
      const storedUser = localStorage.getItem('sasmika_currentUser');

      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Failed to load storage data', e);
    }
    setIsLoaded(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sasmika_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sasmika_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (currentUser) {
        localStorage.setItem('sasmika_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sasmika_currentUser');
      }
    }
  }, [currentUser, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart = [...prevCart];

      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity += quantity;
      } else {
        updatedCart.push({
          id: product.id,
          name: product.name,
          price: product.offerPrice || product.price,
          brand: product.brand,
          category: product.category,
          type: product.type || '',
          image: product.image || '',
          specs: product.specs || '',
          quantity
        });
      }
      return updatedCart;
    });
    // Call showToast OUTSIDE the setCart callback to avoid render-phase updates
    showToast('Product added to cart! 🛒', 'success');
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    // Call showToast OUTSIDE the setCart callback
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId) => {
    const isAlready = favorites.includes(productId);
    if (isAlready) {
      setFavorites((prevFavs) => prevFavs.filter((id) => id !== productId));
      showToast('Removed from favorites', 'info');
      return false;
    } else {
      setFavorites((prevFavs) => [...prevFavs, productId]);
      showToast('Added to favorites! ❤️', 'success');
      return true;
    }
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const loginUser = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! 👋`, 'success');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        currentUser,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        loginUser,
        logout,
        cartCount,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
