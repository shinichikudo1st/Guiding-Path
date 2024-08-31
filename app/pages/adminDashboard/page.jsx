"use client";

import CounselorSidebar from "@/app/components/counselor/counselorSidebar";
import StudentNavbar from "@/app/components/student/studentNavbar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import FullBackground from "@/app/components/universal/fullBackground";

const AdminDashboard = () => {
  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <StudentNavbar />
      <CounselorSidebar />
      <StudentQuickView />
    </main>
  );
};

export default AdminDashboard;
