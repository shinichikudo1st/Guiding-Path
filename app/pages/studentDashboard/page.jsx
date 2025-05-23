"use client";

import { useState, lazy, Suspense } from "react";

// Always visible components - load normally
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import UserNavbar from "@/app/components/UI/userNavbar";
import SkeletonLoading from "@/app/components/universal/skeletonLoading";
import Background from "@/app/components/universal/ctuBackground";

// Conditionally rendered components - lazy load these
const Profile = lazy(() => import("@/app/components/student/sidebar/profile"));
const Appraisal = lazy(() =>
  import("@/app/components/student/sidebar/appraisal")
);
const Appointment = lazy(() =>
  import("@/app/components/student/sidebar/appointment")
);
const Announcement = lazy(() =>
  import("@/app/components/student/sidebar/announcements")
);
const ResourceFeed = lazy(() => import("@/app/components/UI/resources"));

const EventSidebar = lazy(() =>
  import("@/app/components/student/sidebar/event")
);

const StudentDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("profile");

  const components = {
    profile: Profile,
    appraisal: Appraisal,
    appointment: Appointment,
    announcement: Announcement,
    resources: ResourceFeed,
    event: EventSidebar,
  };

  const toggleComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const ActiveComponent = components[activeComponent];

  return (
    <main className="h-full w-full bg-[#D9E7F3]">
      <Background />
      <UserNavbar 
        profile={() => toggleComponent("profile")} 
        onPageChange={(type) => toggleComponent(type)}
      />
      <StudentSidebar
        viewProfile={() => toggleComponent("profile")}
        viewAppraisal={() => toggleComponent("appraisal")}
        viewAppointment={() => toggleComponent("appointment")}
        viewAnnouncement={() => toggleComponent("announcement")}
        viewResources={() => toggleComponent("resources")}
        viewEvent={() => toggleComponent("event")}
        activeComponent={activeComponent}
      />
      <div className="fixed right-0 top-20">
        <StudentQuickView />
      </div>
      <Suspense fallback={<SkeletonLoading />}>
        <ActiveComponent />
      </Suspense>
    </main>
  );
};

export default StudentDashboard;
