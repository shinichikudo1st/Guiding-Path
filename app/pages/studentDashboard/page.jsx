"use client";

import { useState } from "react";

import FullBackground from "@/app/components/universal/fullBackground";
import StudentNavbar from "@/app/components/student/studentNavbar";
import StudentSidebar from "@/app/components/student/studentSidebar";
import StudentQuickView from "@/app/components/student/studentQuickView";
import StudentAppraisal from "@/app/components/student/studentAppraisal";
import SkeletonLoading from "@/app/components/universal/skeletonLoading";
import StartAppraisal from "@/app/components/student/studentStartAppraisal";

const studentDashboard = () => {
  const [appraisalFlag, setAppraisalFlag] = useState(false);
  const [otherButton, setOtherButton] = useState(true);
  const [start, setStart] = useState(false);

  const appraisalToggle = () => {
    setAppraisalFlag(true);
    setOtherButton(false);
  };

  const otherToggle = () => {
    setOtherButton(true);
    setAppraisalFlag(false);
  };

  const startToggle = () => {
    setStart(true);
  };

  return (
    <main className="h-[100vh] w-full bg-[#D9E7F3]">
      <FullBackground />
      <StudentNavbar />
      <StudentSidebar appraisal={appraisalToggle} otherButton={otherToggle} />
      <StudentQuickView />
      {appraisalFlag ? (
        <>
          <StudentAppraisal toggle={startToggle} status={start} />
          <StartAppraisal status={start} />
        </>
      ) : otherButton ? (
        <SkeletonLoading />
      ) : null}
    </main>
  );
};

export default studentDashboard;
