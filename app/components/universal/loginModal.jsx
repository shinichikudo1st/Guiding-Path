"use client";
import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginModal = ({ login, signup, toggleLogin, toggleSignup }) => {
  const [error, setError] = useState(null);
  const [logging, setLogging] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLogging(!logging);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("/api/loginUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result.message);
      setLogging(!logging);

      if (result.role === "counselor") {
        router.push("/pages/adminDashboard");
      } else if (result.role === "student") {
        router.push("/pages/studentDashboard");
      } else if (result.role === "teacher") {
        router.push("/pages/teacherDashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const id = formData.get("idNumber");
    const email = formData.get("email");
    const contact = formData.get("contact");

    const data = {
      id: id,
      email: email,
      contact: contact,
    };

    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[80%] h-[65%] 2xl:w-[33%] 2xl:h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 lg:translate-y-[-20px] ${
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
        <div className="flex flex-col items-center">
          <span className="text-[#062341] text-[10pt] lg:text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341] text-[6pt] lg:text-[13pt]">
            Login existing account
          </span>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center gap-5"
        >
          <input
            type="text"
            placeholder="Email"
            name="email"
            id="emailLogin"
            required
            className="text-[10pt] lg:text-[12pt] 2xl:h-[50px] 2xl:w-[300px] 2xl:p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            required
            className="text-[10pt] lg:text-[12pt] 2xl:h-[50px] 2xl:w-[300px] 2xl:p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <button
            disabled={logging}
            type="submit"
            className="bg-[#0B6EC9] w-[150px] h-[30px] text-[10pt] lg:text-[12pt] lg:w-[200px] lg:h-[40px] rounded-[5px] lg:rounded-[10px] font-bold 2xl:mt-[100px] flex justify-center items-center text-[#F3F8FC]"
          >
            {logging ? (
              <div className="absolute flex space-x-2 justify-center items-center dark:invert">
                <span className="sr-only">Loading...</span>
                <div className="h-[8px] w-[8px] bg-[#F3F8FC] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-[8px] w-[8px] bg-[#F3F8FC] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-[8px] w-[8px] bg-[#F3F8FC] rounded-full animate-bounce"></div>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <span className=" text-[#818487] text-[7pt] lg:text-sm mt-3">
          Dont have an account?{" "}
          <u
            className=" text-[#0A72D1] cursor-pointer font-semibold"
            onClick={toggleSignup}
          >
            Signup Now
          </u>
        </span>
      </div>

      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[80%] h-[65%] 2xl:w-[33%] 2xl:h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 lg:translate-y-[-20px] ${
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
        <form
          onSubmit={handleSignup}
          className="flex flex-col items-center gap-[20px] lg:gap-2"
        >
          <input
            type="text"
            placeholder="ID Number"
            name="idNumber"
            id="idNumber"
            className="text-[10pt] lg:text-[12pt] 2xl:h-[50px] 2xl:w-[300px] 2xl:p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="emailSignup"
            className=" text-[10pt] lg:text-[12pt] 2xl:h-[50px] 2xl:w-[300px] 2xl:p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="text"
            placeholder="Contact No."
            name="contact"
            id="contact"
            className=" text-[10pt] lg:text-[12pt] 2xl:h-[50px] 2xl:w-[300px] 2xl:p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <button
            className="bg-[#0B6EC9] w-[150px] h-[30px] text-[10pt] lg:text-[12pt] lg:w-[200px] lg:h-[40px] rounded-[5px] lg:rounded-[10px] mt-2 font-bold 2xl:mt-10 text-[#F3F8FC]"
            type="submit"
          >
            Create Account
          </button>
        </form>
        <span className=" text-[#818487] text-[7pt] lg:text-sm mt-1">
          Already have an existing account?{" "}
          <u
            className=" text-[#0A72D1] cursor-pointer font-semibold"
            onClick={toggleLogin}
          >
            Login
          </u>
        </span>
      </div>
    </>
  );
};

export default LoginModal;
