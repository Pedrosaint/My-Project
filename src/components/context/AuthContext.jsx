import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../Firebase/Firebase"; // Ensure Firestore is imported
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  updateDoc,
  Timestamp,
} from "firebase/firestore"; // Firestore methods

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUserCount, setActiveUserCount] = useState(0); // Track active users

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });

            // Set user as active in Firestore
            await updateDoc(userDocRef, { isActive: true });
          } else {
            setCurrentUser(user); // Fallback to just auth data
          }
        } catch (error) {
          console.error("Error fetching or updating user data:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Track active users
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Users"),
      (snapshot) => {
        let activeUsers = 0;

        snapshot.forEach((doc) => {
          const user = doc.data();
          if (user.isActive) {
            activeUsers += 1;
          }
        });

        setActiveUserCount(activeUsers);
      },
      (error) => {
        console.error("Error fetching active users:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper function to safely update Firestore documents
  const safeUpdateDoc = async (docRef, data) => {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, data);
      } else {
        console.warn("Document does not exist, skipping update:", docRef.id);
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  // Email & Password Registration
  const register = async (email, password, fname, lname) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // Update Firebase Auth profile
    await updateProfile(user, {
      displayName: `${fname} ${lname}`,
    });

    // Save user to Firestore with `merge: true`
    await setDoc(
      doc(db, "Users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        fullName: `${fname} ${lname}`,
        createdAt: Timestamp.now(),
        role: "Customer", // Default role
        isActive: true, // Set active on registration
      },
      { merge: true }
    );

    setCurrentUser({
      ...user,
      fullName: `${fname} ${lname}`,
      role: "Customer",
    });
    return userCredential;
  };

  // Email & Password Login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // Fetch user details from Firestore and set active
    const userDocRef = doc(db, "Users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      await safeUpdateDoc(userDocRef, { isActive: true }); // Set user as active
      setCurrentUser({ ...user, ...userDoc.data() });
    } else {
      setCurrentUser(user); // Fallback to just auth data
    }

    return userCredential;
  };

  // Logout
  const logout = async () => {
    try {
      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid);
        await safeUpdateDoc(userDocRef, { isActive: false }); // Set user as inactive
      }
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Google Authentication
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Check if user exists in Firestore, otherwise create entry with `merge: true`
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || "No Name",
          createdAt: Timestamp.now(),
          role: "Customer", // Default role
          isActive: true, // Set active on login
        },
        { merge: true }
      );

      setCurrentUser(user);
    } catch (error) {
      console.error("Google Login Error:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeUserCount, // Provide active user count in context
        login,
        register,
        logout,
        googleLogin,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;






// // Modified AuthProvider Component
// import React, { createContext, useState, useEffect } from "react";
// import { auth, db } from "../Firebase/Firebase"; // Ensure Firestore is imported
// import {
//   onAuthStateChanged,
//   signOut,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile,
// } from "firebase/auth";
// import {
//   doc,
//   setDoc,
//   getDoc,
//   collection,
//   onSnapshot,
//   updateDoc,
//   Timestamp,
// } from "firebase/firestore"; // Firestore methods

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeUserCount, setActiveUserCount] = useState(0); // Track active users
//   const [guestCart, setGuestCart] = useState(() => {
//     // Load guest cart from localStorage
//     try {
//       return JSON.parse(localStorage.getItem("guestCart")) || [];
//     } catch {
//       return [];
//     }
//   });

//   // Save guest cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("guestCart", JSON.stringify(guestCart));
//   }, [guestCart]);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userDocRef = doc(db, "Users", user.uid);
//           const userDoc = await getDoc(userDocRef);

//           let userCart = [];

//           if (userDoc.exists()) {
//             userCart = userDoc.data().cart || [];
//             setCurrentUser({ ...user, ...userDoc.data() });
//           } else {
//             setCurrentUser(user);
//           }

//           // Merge guest cart with user cart
//           const mergedCart = [...userCart, ...guestCart];
//           const uniqueCart = mergedCart.reduce((acc, item) => {
//             if (!acc.some((i) => i.id === item.id)) {
//               acc.push(item);
//             }
//             return acc;
//           }, []);

//           // Save merged cart to Firestore
//           await updateDoc(userDocRef, { cart: uniqueCart });
//           setGuestCart([]); // Clear guest cart

//         } catch (error) {
//           console.error("Error fetching or updating user data:", error);
//           console.log(localStorage);

//         }
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [guestCart]);

//   // Track active users
//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       collection(db, "Users"),
//       (snapshot) => {
//         let activeUsers = 0;

//         snapshot.forEach((doc) => {
//           const user = doc.data();
//           if (user.isActive) {
//             activeUsers += 1;
//           }
//         });

//         setActiveUserCount(activeUsers);
//       },
//       (error) => {
//         console.error("Error fetching active users:", error);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Helper function to safely update Firestore documents
//   const safeUpdateDoc = async (docRef, data) => {
//     try {
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         await updateDoc(docRef, data);
//       } else {
//         console.warn("Document does not exist, skipping update:", docRef.id);
//       }
//     } catch (error) {
//       console.error("Error updating document:", error);
//     }
//   };

//   // Email & Password Registration
//   const register = async (email, password, fname, lname) => {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const { user } = userCredential;

//     // Update Firebase Auth profile
//     await updateProfile(user, {
//       displayName: `${fname} ${lname}`,
//     });

//     // Save user to Firestore with `merge: true`
//     await setDoc(
//       doc(db, "Users", user.uid),
//       {
//         uid: user.uid,
//         email: user.email,
//         fullName: `${fname} ${lname}`,
//         createdAt: Timestamp.now(),
//         role: "Customer", // Default role
//         isActive: true, // Set active on registration
//       },
//       { merge: true }
//     );

//     setCurrentUser({
//       ...user,
//       fullName: `${fname} ${lname}`,
//       role: "Customer",
//     });
//     return userCredential;
//   };

//   // Email & Password Login
//   const login = async (email, password) => {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const { user } = userCredential;

//     // Fetch user details from Firestore and set active
//     const userDocRef = doc(db, "Users", user.uid);
//     const userDoc = await getDoc(userDocRef);
//     if (userDoc.exists()) {
//       await safeUpdateDoc(userDocRef, { isActive: true }); // Set user as active
//       setCurrentUser({ ...user, ...userDoc.data() });
//     } else {
//       setCurrentUser(user); // Fallback to just auth data
//     }

//     return userCredential;
//   };

//   // Logout
//   const logout = async () => {
//     try {
//       if (currentUser) {
//         const userDocRef = doc(db, "Users", currentUser.uid);
//         await safeUpdateDoc(userDocRef, { isActive: false }); // Set user as inactive
//       }
//       await signOut(auth);
//       setCurrentUser(null);
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   // Google Authentication
//   const googleLogin = async () => {
//     const provider = new GoogleAuthProvider();
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const { user } = result;

//       // Check if user exists in Firestore, otherwise create entry with `merge: true`
//       const userDocRef = doc(db, "Users", user.uid);
//       await setDoc(
//         userDocRef,
//         {
//           uid: user.uid,
//           email: user.email,
//           fullName: user.displayName || "No Name",
//           createdAt: Timestamp.now(),
//           role: "Customer", // Default role
//           isActive: true, // Set active on login
//         },
//         { merge: true }
//       );

//       setCurrentUser(user);
//     } catch (error) {
//       console.error("Google Login Error:", error.message);
//       throw error;
//     }
//   };

//   const addToCart = (product) => {
//     if (currentUser) {
//       // User logged in, update Firestore cart
//       const userDocRef = doc(db, "Users", currentUser.uid);
//       updateDoc(userDocRef, {
//         cart: [...(currentUser.cart || []), product],
//       });
//     } else {
//       // Guest user, update local cart
//       setGuestCart((prev) => [...prev, product]);
//     }
//   };

//   const removeFromCart = (productId) => {
//     if (currentUser) {
//       // User logged in, update Firestore cart
//       const userDocRef = doc(db, "Users", currentUser.uid);
//       updateDoc(userDocRef, {
//         cart: (currentUser.cart || []).filter((item) => item.id !== productId),
//       });
//     } else {
//       // Guest user, update local cart
//       setGuestCart((prev) => prev.filter((item) => item.id !== productId));
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         activeUserCount, // Provide active user count in context
//         login,
//         register,
//         logout,
//         googleLogin,
//         addToCart,
//         removeFromCart,
//         guestCart,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
