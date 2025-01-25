import React, { useState, useEffect } from "react";

const LoadingText = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500); // Change dots every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <p className="flex justify-center items-center h-screen font-serif bg-gray-500 text-black font-medium">
      Loading user information{dots}
    </p>
  );
};

export default LoadingText;
