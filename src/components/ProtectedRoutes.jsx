import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./Firebase/Firebase"; // Adjust the path based on your setup

const ProtectedRoutes = ({ children }) => {
  const user = auth.currentUser;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
