"use client";
import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DOMPurify from "dompurify";

const LoginModal = ({ login, signup, toggleLogin, toggleSignup }) => {
  const [error, setError] = useState(null);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An error occurred during signup");
      }

      console.log(result.message);
      setIsCreatingAccount(false);
      toggleLogin(); // Switch to login modal after successful signup
      setError("Account created successfully. Please log in.");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
      setIsCreatingAccount(false);
    }
  };

  return (
    <>
      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[80%] h-[65%] 2xl:w-[33%] 2xl:h-[75vh] rounded-[10px] flex flex-col items-center p-5 lg:translate-y-[-20px] shadow-lg ${
          login
            ? "top-[20%] lg:top-[23%] translate-x-[140px] lg:translate-x-0  ease-in duration-[0.2s]"
            : "top-[20%] lg:top-[23%] translate-x-[500px] lg:translate-x-[1000px] ease-out duration-[0.2s]"
        }`}
      >
        <Image
          src={ctuLogo}
          alt="ctuLogo"
          className="w-[50px] h-[50px] lg:w-[80px] lg:h-[80px]"
        />
        <div className="flex flex-col items-center mb-8">
          <span className="text-[#062341] text-[10pt] lg:text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341] text-[6pt] lg:text-[13pt]">
            Login existing account
          </span>
        </div>
        {error && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-b-[10px] transition-opacity duration-300"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-5 w-full max-w-[300px] mt-[10%]"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="emailLogin"
              required
              className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
            />
          </div>
          <div className="relative w-full">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              id="password"
              required
              className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 pr-10 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            disabled={logging}
            type="submit"
            className="bg-[#0B6EC9] w-full h-[40px] text-[10pt] lg:text-[12pt] rounded-md font-bold text-[#F3F8FC] hover:bg-[#095396] transition duration-200 flex justify-center items-center"
          >
            {logging ? (
              <div className="flex space-x-2 justify-center items-center">
                <span className="sr-only">Loading...</span>
                <div className="h-2 w-2 bg-[#F3F8FC] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-[#F3F8FC] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-[#F3F8FC] rounded-full animate-bounce"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <span className="text-[#818487] text-[7pt] lg:text-sm mt-3">
          Don't have an account?{" "}
          <button
            className="text-[#0A72D1] font-semibold hover:underline focus:outline-none"
            onClick={toggleSignup}
          >
            Signup Now
          </button>
        </span>
      </div>

      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[80%] h-[65%] 2xl:w-[33%] 2xl:h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 lg:translate-y-[-20px] shadow-lg ${
          signup
            ? "translate-x-[140px] top-[20%] lg:top-[23%] lg:translate-x-[-600px] 2xl:translate-x-[-900px] ease-in duration-[0.2s]"
            : "translate-x-[-250px] top-[20%] lg:top-[23%] lg:translate-x-[-1300px] 2xl:translate-x-[-1800px] ease-out duration-[0.2s]"
        }`}
      >
        <Image
          src={ctuLogo}
          alt="ctuLogo"
          className="w-[50px] h-[50px] lg:w-[80px] lg:h-[80px]"
        />
        <div className="flex flex-col items-center">
          <span className="text-[#062341] text-[10pt] lg:text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341] text-[6pt] lg:text-[13pt]">
            Create an account
          </span>
        </div>
        {error && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-b-[10px] transition-opacity duration-300"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form
          onSubmit={handleSignup}
          className="flex flex-col items-center gap-4 w-full max-w-[300px] mt-[5%]"
        >
          <input
            type="text"
            placeholder="ID Number"
            name="idNumber"
            id="idNumber"
            className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="emailSignup"
            className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
          />
          <input
            type="text"
            placeholder="Contact No."
            name="contact"
            id="contact"
            className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
          />
          <div className="relative w-full">
            <input
              type={showSignupPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              id="signupPassword"
              required
              className="w-full text-[10pt] lg:text-[12pt] h-[40px] 2xl:h-[50px] px-3 py-2 pr-10 text-[#062341] bg-white border-2 border-[#0B6EC9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-200"
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showSignupPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            className={`w-full h-[40px] text-[10pt] lg:text-[12pt] rounded-md font-bold text-[#F3F8FC] transition duration-200 mt-2 ${
              isCreatingAccount
                ? "bg-[#0B6EC9] opacity-70 cursor-not-allowed"
                : "bg-[#0B6EC9] hover:bg-[#095396]"
            }`}
            type="submit"
            disabled={isCreatingAccount}
          >
            {isCreatingAccount ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-[#F3F8FC] rounded-full animate-spin mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <span className="text-[#818487] text-[7pt] lg:text-sm mt-1">
          Already have an existing account?{" "}
          <button
            className="text-[#0A72D1] font-semibold hover:underline focus:outline-none"
            onClick={toggleLogin}
          >
            Login
          </button>
        </span>
      </div>
    </>
  );
};

export default LoginModal;
