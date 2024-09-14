"use client";
import StudentQuickView from "@/app/components/student/studentQuickView";
import TeacherSidebar from "@/app/components/teacher/teacherSidebar";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const TeacherDashboard = () => {
  const [profile, setProfile] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [referral, setReferral] = useState(false);
  const [resources, setResources] = useState(false);

  const toggleProfile = () => {
    setAppointment(false);
    setReferral(false);
    setResources(false);
    setProfile(true);
  };

  const toggleAppointment = () => {
    setReferral(false);
    setResources(false);
    setProfile(false);
    setAppointment(true);
  };

  const toggleReferral = () => {
    setAppointment(false);
    setResources(false);
    setProfile(false);
    setReferral(true);
  };

  const toggleResources = () => {
    setAppointment(false);
    setReferral(false);
    setProfile(false);
    setResources(true);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <StudentQuickView />
      <TeacherSidebar
        profile={toggleProfile}
        appointment={toggleAppointment}
        referral={toggleReferral}
        resource={toggleResources}
      />
    </main>
  );
};

export default TeacherDashboard;
