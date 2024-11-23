import { useState } from "react";
import GeneralAppraisalReport from "./appraisalReport/generalReport";
import StudentAppraisalReport from "./appraisalReport/studentAppraisalReport";
import { motion } from "framer-motion";

const AppraisalReport = () => {
  const [activeReport, setActiveReport] = useState("general");

  const reports = [
    { id: "general", label: "General Report" },
    { id: "student", label: "Student Reports" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4 bg-white rounded-full p-1 shadow-md">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeReport === report.id
                ? "bg-[#0B6EC9] text-white"
                : "text-[#062341] hover:bg-[#0B6EC9]/5"
            }`}
          >
            {report.label}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeReport === "general" && <GeneralAppraisalReport />}
        {activeReport === "student" && <StudentAppraisalReport />}
      </motion.div>
    </div>
  );
};

export default AppraisalReport;
