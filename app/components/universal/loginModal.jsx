"use client";
import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";

const LoginModal = ({
  login,
  signup,
  toggleLogin,
  toggleSignup,
  closeModal,
}) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [logging, setLogging] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLogging(true);

    const formData = new FormData(e.target);
    const email = DOMPurify.sanitize(formData.get("email"));
    const password = DOMPurify.sanitize(formData.get("password"));

    if (!email || !password) {
      setError("Email and password are required");
      setLogging(false);
      return;
    }

    const data = { email, password };

    try {
      const response = await fetch("/api/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred during login");
      }

      console.log(result.message);

      if (result.role === "counselor") {
        router.push("/pages/adminDashboard");
      } else if (result.role === "student") {
        router.push("/pages/studentDashboard");
      } else if (result.role === "teacher") {
        router.push("/pages/teacherDashboard");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLogging(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsCreatingAccount(true);

    const formData = new FormData(e.target);
    const id = DOMPurify.sanitize(formData.get("idNumber"));
    const email = DOMPurify.sanitize(formData.get("email"));
    const contact = DOMPurify.sanitize(formData.get("contact"));
    const password = DOMPurify.sanitize(formData.get("password"));

    if (!id || !email || !contact || !password) {
      setError("All fields are required");
      setIsCreatingAccount(false);
      return;
    }

    const data = { id, email, contact, password };

    try {
      const response = await fetch("/api/userOption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred during signup");
      }

      setSuccess("Account created successfully! You can now login.");
      setTimeout(() => {
        toggleLogin();
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {login && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 40 }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 41 }}
          />
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 42 }}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Image
                src={ctuLogo}
                alt="CTU Logo"
                width={80}
                height={80}
                className="rounded-full drop-shadow-lg"
              />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-[#062341] mb-8"
            >
              Welcome Back
            </motion.h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                type="submit"
                disabled={logging}
                className="w-full bg-[#0B6EC9] text-white py-3 rounded-lg font-semibold hover:bg-[#095396] transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {logging ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center text-gray-600"
            >
              Don't have an account?{" "}
              <button
                onClick={toggleSignup}
                className="text-[#0B6EC9] font-semibold hover:text-[#095396] transition-colors duration-200"
              >
                Sign Up
              </button>
            </motion.p>
          </motion.div>
        </div>
      )}

      {signup && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 40 }}
        >
          <motion.div
            className="absolute inset-0 bg-black"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 41 }}
          />
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ zIndex: 42 }}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Image
                src={ctuLogo}
                alt="CTU Logo"
                width={80}
                height={80}
                className="rounded-full drop-shadow-lg"
              />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-[#062341] mb-8"
            >
              Create Account
            </motion.h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm"
              >
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              {[
                {
                  label: "ID Number",
                  name: "idNumber",
                  type: "text",
                  placeholder: "Enter your ID number",
                },
                {
                  label: "Email Address",
                  name: "email",
                  type: "email",
                  placeholder: "Enter your email",
                },
                {
                  label: "Contact Number",
                  name: "contact",
                  type: "tel",
                  placeholder: "Enter your contact number",
                },
                {
                  label: "Password",
                  name: "password",
                  type: "password",
                  placeholder: "Create a password",
                },
              ].map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={
                        field.name === "password"
                          ? showSignupPassword
                            ? "text"
                            : "password"
                          : field.type
                      }
                      name={field.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={field.placeholder}
                      required
                    />
                    {field.name === "password" && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignupPassword(!showSignupPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                type="submit"
                disabled={isCreatingAccount}
                className="w-full bg-[#0B6EC9] text-white py-3 rounded-lg font-semibold hover:bg-[#095396] transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isCreatingAccount ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-center text-gray-600"
            >
              Already have an account?{" "}
              <button
                onClick={toggleLogin}
                className="text-[#0B6EC9] font-semibold hover:text-[#095396] transition-colors duration-200"
              >
                Sign In
              </button>
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
