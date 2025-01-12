import React, { createContext, useReducer, useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const initialState = { cart: [], cartCount: 0 };

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        cart: action.payload,
        cartCount: action.payload.length,
      };
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart; // Do nothing
      } else {
        updatedCart = [...state.cart, action.payload];
      }
      return {
        cart: updatedCart,
        cartCount: updatedCart.length,
      };
    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      return {
        cart: filteredCart,
        cartCount: filteredCart.length,
      };
    default:
      return state;
  }
};

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Manage authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set logged-in user ID
      } else {
        setUserId(null);
        dispatch({ type: "SET_CART", payload: [] }); // Clear cart when logged out
      }
    });

    return () => unsubscribe();
  }, []);

  // Load cart data from Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      setLoading(true);
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch({ type: "SET_CART", payload: docSnap.data().cart || [] });
      } else {
        dispatch({ type: "SET_CART", payload: [] });
      }
      setLoading(false);
    };

    fetchCart();

    // Realtime updates (optional)
    const unsubscribe = onSnapshot(doc(db, "carts", userId), (docSnap) => {
      if (docSnap.exists()) {
        dispatch({ type: "SET_CART", payload: docSnap.data().cart || [] });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Save cart data to Firestore
  useEffect(() => {
    if (!userId) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", userId);
        await setDoc(docRef, { cart: state.cart }, { merge: true });
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    if (!loading) {
      saveCart();
    }
  }, [state.cart, userId, loading]);

  return (
    <CartContext.Provider
      value={{ cart: state.cart, cartCount: state.cartCount, dispatch }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
