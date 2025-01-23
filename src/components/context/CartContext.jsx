import React, { createContext, useReducer, useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Initial state
const initialState = { cart: [], cartCount: 0 };

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      console.log("Setting cart state:", action.payload);
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
        updatedCart = state.cart.map((item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedCart = [...state.cart, action.payload];
      }

      console.log("Cart after ADD_TO_CART:", updatedCart);
      return {
        cart: updatedCart,
        cartCount: updatedCart.length,
      };
    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      console.log("Cart after REMOVE_FROM_CART:", filteredCart);
      return {
        cart: filteredCart,
        cartCount: filteredCart.length,
      };
    case "CLEAR_CART":
      console.log("Cart cleared.");

      if (action.userId) {
        const docRef = doc(db, "carts", action.userId);
        setDoc(docRef, { cart: [] }, { merge: true }); // Clear from Firestore
        console.log("Cart cleared from Firestore.");
      }

      return {
        cart: [],
        cartCount: 0,
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
        console.log("User logged in:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("User logged out.");
        setUserId(null);
        dispatch({ type: "SET_CART", payload: [] });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load cart from Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      setLoading(true);
      console.log("Fetching cart from Firestore for user:", userId);
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);

      let firestoreCart = [];
      if (docSnap.exists()) {
        firestoreCart = docSnap.data().cart || [];
        console.log("Cart fetched from Firestore:", firestoreCart);
      }

      if (firestoreCart.length === 0) {
        console.log("Cart is empty in Firestore, keeping it empty.");
        dispatch({ type: "SET_CART", payload: [] });
      } else {
        dispatch({ type: "SET_CART", payload: firestoreCart });
      }

      setLoading(false);
    };

    fetchCart();

    // Realtime updates
    const unsubscribe = onSnapshot(doc(db, "carts", userId), (docSnap) => {
      if (docSnap.exists()) {
        const updatedCart = docSnap.data().cart || [];
        console.log("Realtime Firestore update:", updatedCart);

        if (updatedCart.length === 0) {
          console.log(
            "Realtime update detected an empty cart, keeping it empty."
          );
          dispatch({ type: "SET_CART", payload: [] });
        } else {
          dispatch({ type: "SET_CART", payload: updatedCart });
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Save cart data to Firestore
  useEffect(() => {
    if (!userId || loading) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", userId);

        if (state.cart.length === 0) {
          await setDoc(docRef, { cart: [] });
          console.log("Cart cleared from Firestore after payment.");
        } else {
          await setDoc(docRef, { cart: state.cart }, { merge: true });
          console.log("Cart saved to Firestore:", state.cart);
        }
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    };

    const debounceTimeout = setTimeout(saveCart, 500);
    return () => clearTimeout(debounceTimeout);
  }, [state.cart, userId, loading]);

  // Function to clear the cart after payment
  const clearCartAfterPayment = () => {
    dispatch({ type: "CLEAR_CART", userId });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        cartCount: state.cartCount,
        dispatch,
        clearCartAfterPayment,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
