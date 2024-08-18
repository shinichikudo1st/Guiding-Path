"use client";

import { useState } from "react";

import FullBackground from "@/app/components/universal/fullBackground";
import StudentNavbar from "@/app/components/student/studentNavbar";
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import Profile from "@/app/components/student/sidebar/profile";

const studentDashboard = () => {
  const [profileFlag, setProfileFlag] = useState(true);

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <StudentNavbar />
      <StudentSidebar />
      <StudentQuickView />
      {profileFlag && <Profile />}
    </main>
  );
};

export default studentDashboard;
