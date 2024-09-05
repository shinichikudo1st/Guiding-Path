"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import AppointmentCounselor from "@/app/components/counselor/sidebar/appointment";
import GenerateReport from "@/app/components/counselor/sidebar/generateReport";
import UserManagement from "@/app/components/counselor/sidebar/userManagement";
import StudentQuickView from "@/app/components/student/studentQuickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const AdminDashboard = () => {
  const [userManagement, setUserManagement] = useState(false);
  const [generateReport, setGenerateReport] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [otherButton, setOtherButton] = useState(false);

  const toggleUserManagement = () => {
    setAppointment(false);
    setOtherButton(false);
    setGenerateReport(false);
    setUserManagement(true);
  };

  const toggleReport = () => {
    setAppointment(false);
    setOtherButton(false);
    setUserManagement(false);
    setGenerateReport(true);
  };

  const toggleAppointment = () => {
    setOtherButton(false);
    setUserManagement(false);
    setGenerateReport(false);
    setAppointment(true);
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
        appointment={toggleAppointment}
      />
      <StudentQuickView />
      {userManagement && <UserManagement />}
      {generateReport && <GenerateReport />}
      {appointment && <AppointmentCounselor />}
    </main>
  );
};

export default AdminDashboard;
