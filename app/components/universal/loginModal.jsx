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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [userType, setUserType] = useState("student");
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
    const name = DOMPurify.sanitize(formData.get("name"));
    const department = DOMPurify.sanitize(formData.get("department"));
    const type = DOMPurify.sanitize(formData.get("type"));
    const course =
      type === "student" ? DOMPurify.sanitize(formData.get("course")) : "";
    const year =
      type === "student" ? DOMPurify.sanitize(formData.get("year")) : "";
    const password = DOMPurify.sanitize(formData.get("password"));
    const contact = DOMPurify.sanitize(formData.get("contact"));

    if (!id || !email || !name || !department || !type || !password) {
      setError("All fields are required");
      setIsCreatingAccount(false);
      return;
    }

    const data = {
      id,
      email,
      name,
      department,
      type,
      course,
      year,
      password,
      contact,
    };

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
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.6,
        bounce: 0.25,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {login && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 lg:p-8"
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
            className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 w-full max-w-md relative mx-4 max-h-[95vh] lg:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
                    className="w-full px-4 py-3 text-[#062341] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 text-[#062341] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <Image
                  src={ctuLogo}
                  alt="CTU Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <h2 className="text-2xl font-bold text-[#062341]">
                  Create Account
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSignup} className="flex gap-12">
              {/* Left Column - New Fields */}
              <div className="flex-1 space-y-5 bg-gradient-to-br from-blue-50 to-transparent p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#062341] mb-6">
                  Personal Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your department"
                  >
                    <option disabled value="">
                      Select Department
                    </option>
                    <option value="COE">College of Education</option>
                    <option value="COT">College of Technology</option>
                    <option value="COEN">College of Engineering</option>
                    <option value="CAS">College of Arts and Sciences</option>
                    <option value="CME">
                      College of Management and Entrepreneurship
                    </option>
                    <option value="CCICT">
                      College of Computer Information and Communications
                      Technology
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="type"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                {userType === "student" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course
                      </label>
                      <input
                        type="text"
                        name="course"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                        placeholder="Enter your course"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Level
                      </label>
                      <select
                        name="year"
                        required
                        className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      >
                        <option disabled value="">
                          Select Year Level
                        </option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Existing Fields */}
              <div className="flex-1 space-y-5 bg-gradient-to-br from-blue-50 to-transparent p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#062341] mb-6">
                  Account Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your ID number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    placeholder="Contact Number"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingAccount}
                  className="w-full bg-[#0B6EC9] text-white py-3 rounded-lg font-semibold hover:bg-[#095396] transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 mt-6"
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
                </button>

                <p className="text-sm text-center mt-4 text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleLogin}
                    className="text-[#0B6EC9] font-semibold hover:text-[#095396] transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
              >
                {success}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
