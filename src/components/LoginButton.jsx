import React, { useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";

const LoginButton = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // Get currentUser from AuthContext

  const handleAction = () => {
    if (currentUser) {
      navigate("/Profile"); // Navigate to the logout confirmation page
    } else {
      navigate("/login"); // Navigate to the login page
    }
  };

  return (
    <div className="flex items-center">
      {/* Account */}
      <button
        onClick={handleAction}
        className="text-xl font-semibold hover:text-primary transition-all duration-300 ease-in-out hidden sm:block"
      >
        {currentUser ? "Profile" : "Login"}
      </button>
      <button
        onClick={handleAction}
        className="sm:hidden hover:text-primary transition-all duration-300 ease-in-out"
      >
        <User size={24} />
      </button>
    </div>
  );
};

export default LoginButton;
