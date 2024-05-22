"use client";

import Introduction from "./introduction";
import LoginModal from "./loginModal";
import Navbar from "./navbar";
import { useState } from "react";

const UserAuth = () => {
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
    <>
      <Navbar login={toggleLogin} signup={toggleSignup} />
      <LoginModal login={loginFlag} signup={signupFlag} />
      <Introduction login={loginFlag} signup={signupFlag} />
    </>
  );
};

export default UserAuth;
