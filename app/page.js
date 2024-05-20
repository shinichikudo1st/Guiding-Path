"use client";

import { useState } from "react";
import Background from "./components/universal/ctuBackground";
import Navbar from "./components/universal/navbar";
import LoginModal from "./components/universal/loginModal";
import Introduction from "./components/universal/introduction";

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
      <Introduction login={loginFlag} signup={signupFlag} />
    </main>
  );
}
