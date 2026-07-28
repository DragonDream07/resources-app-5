import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart';

function loadGuestCart() {
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : { cartId: null, items: [], promoCode: null, summary: null };
  } catch {
    return { cartId: null, items: [], promoCode: null, summary: null };
  }
}

function saveGuestCart(cart) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch {
    // ignore storage errors
  }
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY);
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [cart, setCartState] = useState(() => loadGuestCart());
  const [merging, setMerging] = useState(false);

  // Persist guest cart whenever it changes and user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      saveGuestCart(cart);
    }
  }, [cart, isAuthenticated]);

  // Merge guest cart into authenticated cart on login
  useEffect(() => {
    if (isAuthenticated) {
      const guestCart = loadGuestCart();
      if (guestCart && guestCart.items && guestCart.items.length > 0) {
        setMerging(true);
        // Merge guest items into current cart state
        setCartState((prev) => {
          const merged = { ...prev };
          const existingSkuIds = new Set((prev.items || []).map((i) => i.skuId));
          const newItems = (guestCart.items || []).filter((i) => !existingSkuIds.has(i.skuId));
          merged.items = [...(prev.items || []), ...newItems];
          return merged;
        });
        clearGuestCart();
        setMerging(false);
      }
    }
  }, [isAuthenticated]);

  const setCart = useCallback((newCart) => {
    setCartState(newCart);
  }, []);

  const addItem = useCallback((item) => {
    setCartState((prev) => {
      const items = prev.items || [];
      const idx = items.findIndex((i) => i.skuId === item.skuId);
      let newItems;
      if (idx >= 0) {
        newItems = items.map((i, index) =>
          index === idx ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newItems = [...items, item];
      }
      return { ...prev, items: newItems };
    });
  }, []);

  const updateItem = useCallback((itemId, changes) => {
    setCartState((prev) => ({
      ...prev,
      items: (prev.items || []).map((i) =>
        i.id === itemId || i.itemId === itemId ? { ...i, ...changes } : i
      ),
    }));
  }, []);

  const removeItem = useCallback((itemId) => {
    setCartState((prev) => ({
      ...prev,
      items: (prev.items || []).filter((i) => i.id !== itemId && i.itemId !== itemId),
    }));
  }, []);

  const applyPromo = useCallback((promoCode, summary) => {
    setCartState((prev) => ({ ...prev, promoCode, summary }));
  }, []);

  const clearCart = useCallback(() => {
    const empty = { cartId: null, items: [], promoCode: null, summary: null };
    setCartState(empty);
    clearGuestCart();
  }, []);

  const itemCount = (cart.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);

  const value = {
    cart,
    setCart,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearCart,
    itemCount,
    merging,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

export default CartContext;
