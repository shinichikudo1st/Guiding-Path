"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import AppointmentCounselor from "@/app/components/counselor/sidebar/appointment";
import CreateResources from "@/app/components/counselor/sidebar/createResources";
import GenerateReport from "@/app/components/counselor/sidebar/generateReport";
import CounselorHome from "@/app/components/counselor/sidebar/homeDashboard";
import ProfileCounselor from "@/app/components/counselor/sidebar/profile";
import ReferralCounselor from "@/app/components/counselor/sidebar/referralCounselor";
import UserManagement from "@/app/components/counselor/sidebar/userManagement";
import QuickView from "@/app/components/UI/quickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import { useState } from "react";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("otherButton");

  const components = {
    profile: ProfileCounselor,
    userManagement: UserManagement,
    generateReport: GenerateReport,
    appointment: AppointmentCounselor,
    create: CreateResources,
    otherButton: CounselorHome,
    referral: ReferralCounselor,
  };

  const toggleComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const ActiveComponent = components[activeComponent];

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <UserNavbar />
      <CounselorSidebar
        otherButton={() => toggleComponent("otherButton")}
        userManagement={() => toggleComponent("userManagement")}
        generateReport={() => toggleComponent("generateReport")}
        appointment={() => toggleComponent("appointment")}
        profile={() => toggleComponent("profile")}
        create={() => toggleComponent("create")}
        referral={() => toggleComponent("referral")}
        activeComponent={activeComponent}
      />
      <QuickView />
      <ActiveComponent />
    </main>
  );
};

export default AdminDashboard;
