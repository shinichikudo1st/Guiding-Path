"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import UserManagement from "@/app/components/counselor/sidebar/userManagement";
import StudentQuickView from "@/app/components/student/studentQuickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const AdminDashboard = () => {
  const [userManagement, setUserManagement] = useState(false);
  const [otherButton, setOtherButton] = useState(false);

  const toggleUserManagement = () => {
    setOtherButton(false);
    setUserManagement(true);
  };

  const toggleOtherButton = () => {
    setUserManagement(false);
    setOtherButton(true);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <CounselorSidebar
        otherButton={toggleOtherButton}
        userManagement={toggleUserManagement}
      />
      <StudentQuickView />
      {userManagement && <UserManagement />}
    </main>
  );
};

export default AdminDashboard;
