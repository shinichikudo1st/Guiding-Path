"use client";

import { useState } from "react";
import Background from "./components/universal/ctuBackground";
import Navbar from "./components/universal/navbar";
import LoginModal from "./components/universal/loginModal";
import Hero from "./components/landing/hero";
import Features from "./components/landing/features";
import Footer from "./components/landing/footer";
import Testimonials from "./components/landing/testimonials";

export default function Home() {
  const [loginFlag, setLoginFlag] = useState(false);
  const [signupFlag, setSignupFlag] = useState(false);

  const toggleLogin = () => {
    setLoginFlag(true);
    setSignupFlag(false);
  };
  const toggleSignup = () => {
    setSignupFlag(true);
    setLoginFlag(false);
  };
  const closeModal = () => {
    setLoginFlag(false);
    setSignupFlag(false);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#D9E7F3] to-white overflow-hidden">
      <Navbar login={toggleLogin} signup={toggleSignup} />
      <Background />
      <LoginModal
        login={loginFlag}
        signup={signupFlag}
        toggleLogin={toggleLogin}
        toggleSignup={toggleSignup}
        closeModal={closeModal}
      />
      <Hero onGetStarted={toggleSignup} />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
