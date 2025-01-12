import React, { useState } from "react";
import { db } from "../Firebase/Firebase"; // Replace with the path to your Firebase config
import { collection, addDoc, where, getDocs, query } from "firebase/firestore";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isZoomingOut, setIsZoomingOut] = useState(false); // To handle zoom-out animation

  const handleSubscription = async (e) => {
    e.preventDefault();

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
    }
    
      try {
    const q = query(collection(db, "subscriptions"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert("This email is already subscribed.");
      return;
    }

      await addDoc(collection(db, "subscriptions"), {
        email: email,
        timestamp: new Date(),
      });

      setSuccessMessage("Subscription successful! Thank you.");
      setEmail(""); // Clear the input field

      // Trigger zoom-out animation after showing the success message
      setTimeout(() => {
        setIsZoomingOut(true); // Start zoom-out
        setTimeout(() => {
          setSuccessMessage(""); // Clear success message
          setIsZoomingOut(false); // Reset zoom-out state
        }, 300); // Match the zoom-out animation duration
      }, 2700); // Wait before starting zoom-out animation

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="bg-custom dark:bg-custom_1 text-white">
        <div className="container backdrop-blur-sm py-10">
          <div className="space-y-6 max-w-xl mx-auto">
            <h1 className="text-2xl text-center sm:text-left sm:text-4xl font-semibold text-white">
              Get Notified About New Products
            </h1>

            {/* Input with Enter Button */}
            <form
              className="flex items-center gap-2"
              data-aos="fade-up"
              onSubmit={handleSubscription}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                className="w-full p-3 text-black outline-none rounded-l-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-r-md transition duration-300"
              >
                Send
              </button>
            </form>

            {successMessage && (
              <p
                data-aos={isZoomingOut ? "zoom-out" : "zoom-in"}
                className="bg-green-400 text-center mt-3 rounded-full text-xl font-semibold"
              >
                {successMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
