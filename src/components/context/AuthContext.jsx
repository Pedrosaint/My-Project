import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../Firebase/Firebase";
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
} from "firebase/firestore";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUserCount, setActiveUserCount] = useState(0);

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
    const userData = userDoc.data();
    await safeUpdateDoc(userDocRef, { isActive: true });

    setCurrentUser({
      ...user,
      fullName: userData.fullName || user.displayName || "No Name", // Ensure fullName is set
      role: userData.role || "Customer",
    });
  } else {
    setCurrentUser({
      ...user,
      fullName: user.displayName || "No Name",
      role: "Customer",
    });
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
      const userDoc = await getDoc(userDocRef);
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
        activeUserCount,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;











// import React, { createContext, useState, useEffect, useContext } from "react";
// import { auth, db } from "../Firebase/Firebase";
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
// } from "firebase/firestore";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeUserCount, setActiveUserCount] = useState(0);

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userDocRef = doc(db, "Users", user.uid);
//           const userDoc = await getDoc(userDocRef);

//           if (userDoc.exists()) {
//             setCurrentUser({ ...user, ...userDoc.data() });

//             // Set user as active in Firestore
//             await updateDoc(userDocRef, { isActive: true });
//           } else {
//             setCurrentUser(user); // Fallback to just auth data
//           }
//         } catch (error) {
//           console.error("Error fetching or updating user data:", error);
//         }
//       } else {
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

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
//   // const register = async (email, password, fname, lname) => {
//   //   const userCredential = await createUserWithEmailAndPassword(
//   //     auth,
//   //     email,
//   //     password
//   //   );
//   //   const { user } = userCredential;

//   //   // Update Firebase Auth profile
//   //   await updateProfile(user, {
//   //     displayName: `${fname} ${lname}`,
//   //   });

//   //   // Save user to Firestore with `merge: true`
//   //   await setDoc(
//   //     doc(db, "Users", user.uid),
//   //     {
//   //       uid: user.uid,
//   //       email: user.email,
//   //       fullName: `${fname} ${lname}`,
//   //       createdAt: Timestamp.now(),
//   //       role: "Customer", // Default role
//   //       isActive: true, // Set active on registration
//   //     },
//   //     { merge: true }
//   //   );

//   //   setCurrentUser({
//   //     ...user,
//   //     fullName: `${fname} ${lname}`,
//   //     role: "Customer",
//   //   });
//   //   return userCredential;
//   // };

//   const register = async (email, password, fname, lname) => {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const { user } = userCredential;

//     // Correctly set the display name
//     const fullName = `${fname} ${lname}`;
//     await updateProfile(user, { displayName: fullName });

//     // Save user to Firestore
//     await setDoc(
//       doc(db, "Users", user.uid),
//       {
//         uid: user.uid,
//         email: user.email,
//         fullName, // Store the full name
//         createdAt: Timestamp.now(),
//         role: "Customer", // Default role
//         isActive: true, // Set active on registration
//       },
//       { merge: true }
//     );

//     // Update current user state (if using Context)
//     setCurrentUser({
//       uid: user.uid,
//       email: user.email,
//       displayName: fullName, // Ensure this is updated
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
//       await safeUpdateDoc(userDocRef, { isActive: true });
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
//       const userDoc = await getDoc(userDocRef);
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

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         activeUserCount,
//         login,
//         register,
//         logout,
//         googleLogin,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export default AuthProvider;
