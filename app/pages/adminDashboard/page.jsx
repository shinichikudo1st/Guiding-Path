"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import GenerateReport from "@/app/components/counselor/sidebar/generateReport";
import UserManagement from "@/app/components/counselor/sidebar/userManagement";
import StudentQuickView from "@/app/components/student/studentQuickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const AdminDashboard = () => {
  const [userManagement, setUserManagement] = useState(false);
  const [generateReport, setGenerateReport] = useState(false);
  const [otherButton, setOtherButton] = useState(false);

  const toggleUserManagement = () => {
    setOtherButton(false);
    setGenerateReport(false);
    setUserManagement(true);
  };

  const toggleReport = () => {
    setOtherButton(false);
    setUserManagement(false);
    setGenerateReport(true);
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
        generateReport={toggleReport}
      />
      <StudentQuickView />
      {userManagement && <UserManagement />}
      {generateReport && <GenerateReport />}
    </main>
  );
};

export default AdminDashboard;
