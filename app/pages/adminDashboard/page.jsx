"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import AppointmentCounselor from "@/app/components/counselor/sidebar/appointment";
import GenerateReport from "@/app/components/counselor/sidebar/generateReport";
import ProfileCounselor from "@/app/components/counselor/sidebar/profile";
import UserManagement from "@/app/components/counselor/sidebar/userManagement";
import StudentQuickView from "@/app/components/student/studentQuickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const AdminDashboard = () => {
  const [profile, setProfile] = useState(false);
  const [userManagement, setUserManagement] = useState(false);
  const [generateReport, setGenerateReport] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [otherButton, setOtherButton] = useState(false);

  const toggleProfile = () => {
    setAppointment(false);
    setOtherButton(false);
    setGenerateReport(false);
    setUserManagement(false);
    setProfile(true);
  };

  const toggleUserManagement = () => {
    setAppointment(false);
    setOtherButton(false);
    setGenerateReport(false);
    setProfile(false);
    setUserManagement(true);
  };

  const toggleReport = () => {
    setAppointment(false);
    setOtherButton(false);
    setUserManagement(false);
    setProfile(false);
    setGenerateReport(true);
  };

  const toggleAppointment = () => {
    setOtherButton(false);
    setUserManagement(false);
    setGenerateReport(false);
    setProfile(false);
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
        profile={toggleProfile}
      />
      <StudentQuickView />
      {profile && <ProfileCounselor />}
      {userManagement && <UserManagement />}
      {generateReport && <GenerateReport />}
      {appointment && <AppointmentCounselor />}
    </main>
  );
};

export default AdminDashboard;
