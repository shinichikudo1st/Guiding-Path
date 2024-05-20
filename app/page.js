"use client";

import Background from "./components/ctuBackground";
import Introduction from "./components/introduction";
import LoginModal from "./components/loginModal";
import Navbar from "./components/navbar";

import { useState } from "react";

export default function Home() {
  const [loginFlag, setLoginFlag] = useState(true);
  const [signupFlag, setSignupFlag] = useState(false);

  const toggleLogin = () => {
    setLoginFlag(true);
    setSignupFlag(false);
    
  };
  const toggleSignup = () => {
    setSignupFlag(true);
    setLoginFlag(false);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <Navbar login={toggleLogin} signup={toggleSignup} />
      <Background />
      <LoginModal login={loginFlag} signup={signupFlag} />
      <Introduction login={loginFlag} signup={signupFlag}/>
    </main>
  );
}
