"use client";

import { useState } from "react";

import FullBackground from "@/app/components/universal/fullBackground";
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import Profile from "@/app/components/student/sidebar/profile";
import Appraisal from "@/app/components/student/sidebar/appraisal";
import UserNavbar from "@/app/components/UI/userNavbar";

const studentDashboard = () => {
  const [profileFlag, setProfileFlag] = useState(false);
  const [appraisalFlag, setAppraisalFlag] = useState(false);

  const viewProfile = () => {
    setProfileFlag(true);
    setAppraisalFlag(false);
  };

  const viewAppraisal = () => {
    setAppraisalFlag(true);
    setProfileFlag(false);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <StudentSidebar viewProfile={viewProfile} viewAppraisal={viewAppraisal} />
      <StudentQuickView />
      {profileFlag && <Profile />}
      {appraisalFlag && <Appraisal />}
    </main>
  );
};

export default studentDashboard;
