import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { EyeOff, Eye } from "lucide-react";
import {
  FaRegEnvelope,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Outlet, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { register } = useContext(AuthContext);
  const { googleLogin } = useContext(AuthContext);

  //-----------------------------------------------------
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //------------- Login function ------------------------
  const handleLogin = async () => {
    try {
      await login(email, password);
      toast.success("Login Successful!", {
        position: "top-center",
      });
         navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Login failed", {
        position: "top-center",
      });
    }
  };
  //---------------- Register => -----------------------
  const handleRegister = async () => {
    try {
      await register(email, password, fname, lname);
      toast.success("Registered Succefully!!", {
        position: "top-center",
      });
      setIsLogin(true); // Switch to the login form after registration
    } catch (err) {
        console.error(err);
         toast.error("Already a User", {
           position: "top-center",
         });
    }
  };
  //----------------- Google Login => -------------------
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
       toast.success("User Logged in Successfully!", {
         position: "top-center",
       });
       navigate("/");
    } catch (err) {
      toast.success("Google Login failed");
    }
  };
  //-------------------- Reset Password ------------------------>
  const resetPassword = () => {
    navigate("/reset");
  };

  // ----Toggle between Login and Signup forms---->
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // -----Toggle the visibility of the password----->
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-4">
          <img
            src=""
            alt=""
            className="w-24 mx-auto mb-4 md:w-32 md:absolute md:-top-4 md:left-4"
          />

          <div className="bg-white text-black p-5 m-2 rounded-lg shadow-2xl ">
            <h2 className="text-2xl font-bold mb-2 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <h3 className="text-center text-2xl font-medium mb-6 text-gray-400">
              {isLogin ? "Welcome back!" : ""}
            </h3>
            {isLogin ? (
              // Login Form=------------------->
              <form
                className="space-y-4 p-4"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent form reload
                  handleLogin();
                }}
              >
                <div className="main mt-5">
                  <div className="flex items-center relative">
                    <FaRegEnvelope
                      color="gray"
                      size={17}
                      className="absolute left-2 top-1/2 transform -translate-y-[45%]"
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder=""
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="block text-sm font-medium mb-1">
                      Email address*
                    </label>
                  </div>
                </div>

                <div className="relative password-field main">
                  <div className="flex items-center relative mt-8">
                    <FiLock
                      color="gray"
                      size={17}
                      className="absolute left-2"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="text"
                      id="password"
                      required
                      placeholder=" "
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <button
                      type="button"
                      className="absolute right-2 text-gray-400"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Login
                </button>
                <button
                  className="text-gray-900 sm:ml-48 ml-36"
                  onClick={resetPassword}
                >
                  Forgot passwod?
                </button>
              </form>
            ) : (
              // Signup Form------------------------->
              <form
                className="space-y-4 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div className="flex flex-col sm:flex-row sm:gap-x-4 mt-6">
                  <label className="block text-sm font-medium mb-2 sm:mb-0 sm:flex-1 fname">
                    <input
                      type="text"
                      id="text"
                      name="text"
                      placeholder=" "
                      onChange={(e) => setFname(e.target.value)}
                      required
                    />
                    <span className="block text-sm font-medium mb-1">
                      First Name
                    </span>
                  </label>

                  <label className="block text-sm font-medium mb-1 sm:flex-1 lname">
                    <input
                      type="text"
                      name="text"
                      id="text"
                      placeholder=" "
                      onChange={(e) => setLname(e.target.value)}
                      required
                    />
                    <span className="block text-sm font-medium mb-1">
                      Last Name
                    </span>
                  </label>
                </div>
                <div className="main">
                  <div className="flex items-center relative mt-6">
                    <FaRegEnvelope
                      color="gray"
                      size={17}
                      className="absolute left-2 top-1/2 transform -translate-y-[45%]"
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder=" "
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="block text-sm font-medium mb-1">
                      Email address*
                    </label>
                  </div>
                </div>

                <div className="relative password-field main">
                  <div className="flex items-center relative mt-6">
                    <FiLock
                      color="gray"
                      size={17}
                      className="absolute left-2"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="text"
                      id="password"
                      placeholder=" "
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <button
                      type="button"
                      className="absolute right-2 text-gray-400"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Sign Up
                </button>
              </form>
            )}

            {/* Social Signup Buttons */}
            <div className="">
              <p className="text-sm text-center text-gray-500">
                or sign up with
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  className="bg-[#f1ecec] text-gray-500 p-2 rounded-md hover:text-blue-400 transition-colors flex items-center justify-center"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle size={25} />
                  <span className="font-semibold text-xl ml-5">
                    Continue with Google
                  </span>
                </button>
              </div>
            </div>

            <p className="text-sm mt-6 text-center text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                className="text-blue-500 ml-2 hover:underline"
                onClick={toggleForm}
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default Login;