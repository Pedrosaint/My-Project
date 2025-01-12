import React from "react";
import { toast } from "react-toastify";
import { auth } from "../components/Firebase/Firebase"; // Ensure 'auth' is imported
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValue = e.target.email.value;

    try {
      await sendPasswordResetEmail(auth, emailValue);
      toast.success("Check your email to reset your password.", {
        position: "top-center",
      });
      navigate("/Login"); // Redirect to login page
    } catch (error) {
      console.error(error.message);
      toast.error("Error sending reset email. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-gray-200 p-6 rounded-lg shadow-2xl w-80">
        <h1 className="text-center text-2xl font-bold text-black">
          Forgot Password
        </h1>
        <h3 className="text-center text-xl font-medium mb-4 text-gray-400">
          Reset Password!
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col mt-6 form">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
           required
          />
          <label className="block text-sm font-medium mb-1">
            Email address*
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-6 mb-6"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
