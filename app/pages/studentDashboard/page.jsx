"use client";

import { useState } from "react";

import FullBackground from "@/app/components/universal/fullBackground";
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import Profile from "@/app/components/student/sidebar/profile";
import Appraisal from "@/app/components/student/sidebar/appraisal";
import UserNavbar from "@/app/components/UI/userNavbar";
import Appointment from "@/app/components/student/sidebar/appointment";
import Announcement from "@/app/components/student/sidebar/announcements";

const StudentDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const viewProfile = () => setActiveComponent("profile");
  const viewAppraisal = () => setActiveComponent("appraisal");
  const viewAppointment = () => setActiveComponent("appointment");
  const viewAnnouncement = () => setActiveComponent("announcement");

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <StudentSidebar
        viewProfile={viewProfile}
        viewAppraisal={viewAppraisal}
        viewAppointment={viewAppointment}
        viewAnnouncement={viewAnnouncement}
        activeComponent={activeComponent}
      />
      <StudentQuickView />
      {activeComponent === "profile" && <Profile />}
      {activeComponent === "appraisal" && <Appraisal />}
      {activeComponent === "appointment" && <Appointment />}
      {activeComponent === "announcement" && <Announcement />}
    </main>
  );
};

export default StudentDashboard;
