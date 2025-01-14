import React, { createContext, useReducer, useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Load cart from localStorage
const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
const initialState = { cart: localCart, cartCount: localCart.length };

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
      localStorage.setItem("guestCart", JSON.stringify(updatedCart)); // Save to localStorage
      console.log("Cart after ADD_TO_CART:", updatedCart);
      return {
        cart: updatedCart,
        cartCount: updatedCart.length,
      };
    case "REMOVE_FROM_CART":
      const filteredCart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      localStorage.setItem("guestCart", JSON.stringify(filteredCart)); // Save to localStorage
      console.log("Cart after REMOVE_FROM_CART:", filteredCart);
      return {
        cart: filteredCart,
        cartCount: filteredCart.length,
      };
    case "CLEAR_CART":
      localStorage.removeItem("guestCart"); // Clear localStorage
      console.log("Cart cleared.");
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

  // Sync cart with localStorage on app initialization
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    if (state.cart.length === 0 && savedCart.length > 0) {
      console.log("Initializing cart from localStorage:", savedCart);
      dispatch({ type: "SET_CART", payload: savedCart });
    }
  }, []);

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
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        console.log("Restoring guest cart on logout:", guestCart);
        dispatch({ type: "SET_CART", payload: guestCart });
        
      }
    });

    return () => unsubscribe();
  }, []);

  // Load and merge cart data from Firestore for logged-in users
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

      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      console.log("Merging guest cart with Firestore cart:", guestCart);
      const mergedCart = [...firestoreCart];

      guestCart.forEach((guestItem) => {
        const existingItem = mergedCart.find(
          (item) =>
            item.productId === guestItem.productId &&
            item.size === guestItem.size &&
            item.color === guestItem.color
        );
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          mergedCart.push(guestItem);
        }
      });

      await setDoc(docRef, { cart: mergedCart }, { merge: true });
      console.log("Merged cart saved to Firestore:", mergedCart);

      localStorage.removeItem("guestCart"); // Clear localStorage after merging
      console.log("Cleared guest cart from localStorage.");
      dispatch({ type: "SET_CART", payload: mergedCart });

      setLoading(false);
    };

    fetchCart();

    // Realtime updates (optional)
    const unsubscribe = onSnapshot(doc(db, "carts", userId), (docSnap) => {
      if (docSnap.exists()) {
        console.log("Realtime Firestore update:", docSnap.data().cart);
        dispatch({ type: "SET_CART", payload: docSnap.data().cart || [] });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Save cart data to Firestore for logged-in users
  useEffect(() => {
    if (!userId || loading) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", userId);
        await setDoc(docRef, { cart: state.cart }, { merge: true });
        console.log("Cart saved to Firestore:", state.cart);
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    };

    const debounceTimeout = setTimeout(saveCart, 500); // Debounce save
    return () => clearTimeout(debounceTimeout);
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
