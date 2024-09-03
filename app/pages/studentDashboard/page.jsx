"use client";

import { useState } from "react";

import FullBackground from "@/app/components/universal/fullBackground";
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import Profile from "@/app/components/student/sidebar/profile";
import Appraisal from "@/app/components/student/sidebar/appraisal";
import UserNavbar from "@/app/components/UI/userNavbar";
import Appointment from "@/app/components/student/sidebar/appointment";

const studentDashboard = () => {
  const [profileFlag, setProfileFlag] = useState(false);
  const [appraisalFlag, setAppraisalFlag] = useState(false);
  const [appointmentFlag, setAppointmentFlag] = useState(false);

  const viewProfile = () => {
    setProfileFlag(true);
    setAppraisalFlag(false);
    setAppointmentFlag(false);
  };

  const viewAppraisal = () => {
    setAppraisalFlag(true);
    setProfileFlag(false);
    setAppointmentFlag(false);
  };

  const viewAppointment = () => {
    setAppointmentFlag(true);
    setProfileFlag(false);
    setAppraisalFlag(false);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <StudentSidebar
        viewProfile={viewProfile}
        viewAppraisal={viewAppraisal}
        viewAppointment={viewAppointment}
      />
      <StudentQuickView />
      {profileFlag && <Profile />}
      {appraisalFlag && <Appraisal />}
      {appointmentFlag && <Appointment />}
    </main>
  );
};

export default studentDashboard;
