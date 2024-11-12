"use client";

import { useState, lazy, Suspense } from "react";
import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import QuickViewCounselor from "@/app/components/counselor/quickViewCounselor";
import UserNavbar from "@/app/components/UI/userNavbar";
import FullBackground from "@/app/components/universal/fullBackground";
import SkeletonLoading from "@/app/components/universal/skeletonLoading";

// Lazy load components
const ProfileCounselor = lazy(() =>
  import("@/app/components/counselor/sidebar/profile")
);
const UserManagement = lazy(() =>
  import("@/app/components/counselor/sidebar/userManagement")
);
const GenerateReport = lazy(() =>
  import("@/app/components/counselor/sidebar/generateReport")
);
const AppointmentCounselor = lazy(() =>
  import("@/app/components/counselor/sidebar/appointment")
);
const CreateResources = lazy(() =>
  import("@/app/components/counselor/sidebar/createResources")
);
const CounselorHome = lazy(() =>
  import("@/app/components/counselor/sidebar/homeDashboard")
);
const ReferralCounselor = lazy(() =>
  import("@/app/components/counselor/sidebar/referralCounselor")
);

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
      <UserNavbar profile={() => toggleComponent("profile")} />
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
      <QuickViewCounselor />
      <Suspense fallback={<SkeletonLoading />}>
        <ActiveComponent />
      </Suspense>
    </main>
  );
};

export default AdminDashboard;
