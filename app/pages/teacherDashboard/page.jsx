"use client";
import TeacherAppointment from "@/app/components/teacher/sidebar/appointment";
import ProfileTeacher from "@/app/components/teacher/sidebar/profile";
import TeacherReferral from "@/app/components/teacher/sidebar/referral";
import TeacherSidebar from "@/app/components/teacher/teacherSidebar";
import QuickView from "@/app/components/UI/quickView";
import ResourceFeed from "@/app/components/UI/resources";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const TeacherDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("appointment");

  const toggleProfile = () => setActiveComponent("profile");
  const toggleAppointment = () => setActiveComponent("appointment");
  const toggleReferral = () => setActiveComponent("referral");
  const toggleResources = () => setActiveComponent("resources");

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <QuickView />
      <TeacherSidebar
        profile={toggleProfile}
        appointment={toggleAppointment}
        referral={toggleReferral}
        resource={toggleResources}
        activeComponent={activeComponent}
      />
      {activeComponent === "profile" && <ProfileTeacher />}
      {activeComponent === "referral" && <TeacherReferral />}
      {activeComponent === "resources" && <ResourceFeed />}
      {activeComponent === "appointment" && <TeacherAppointment />}
    </main>
  );
};

export default TeacherDashboard;
