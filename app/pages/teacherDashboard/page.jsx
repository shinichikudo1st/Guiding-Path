"use client";
import { useState, lazy, Suspense } from "react";

// Always visible components - load normally
import TeacherSidebar from "@/app/components/teacher/teacherSidebar";
import QuickView from "@/app/components/UI/quickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import SkeletonLoading from "@/app/components/universal/skeletonLoading";
import Background from "@/app/components/universal/ctuBackground";

// Conditionally rendered components - lazy load these
const ProfileTeacher = lazy(() =>
  import("@/app/components/teacher/sidebar/profile")
);
const TeacherAppointment = lazy(() =>
  import("@/app/components/teacher/sidebar/appointment")
);
const TeacherReferral = lazy(() =>
  import("@/app/components/teacher/sidebar/referral")
);
const ResourceFeed = lazy(() => import("@/app/components/UI/resources"));

const TeacherDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("appointment");

  const components = {
    profile: ProfileTeacher,
    appointment: TeacherAppointment,
    referral: TeacherReferral,
    resources: ResourceFeed,
  };

  const toggleComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const ActiveComponent = components[activeComponent];

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <Background />
      <UserNavbar profile={() => toggleComponent("profile")} />
      <QuickView />
      <TeacherSidebar
        profile={() => toggleComponent("profile")}
        appointment={() => toggleComponent("appointment")}
        referral={() => toggleComponent("referral")}
        resource={() => toggleComponent("resources")}
        activeComponent={activeComponent}
      />
      <Suspense fallback={<SkeletonLoading />}>
        <ActiveComponent />
      </Suspense>
    </main>
  );
};

export default TeacherDashboard;
