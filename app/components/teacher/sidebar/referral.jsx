import { useState } from "react";
import ReferStudent from "../modals/referStudent";
import ViewReferrals from "../modals/viewReferrals";
import { motion } from "framer-motion";

const TeacherReferral = () => {
  const [activeTab, setActiveTab] = useState("viewReferrals");

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Student Referrals
            </h1>
          </div>

          <div className="p-8 sm:p-10">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex w-full justify-center space-x-4 bg-[#E6F0F9] rounded-xl p-1.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTab("viewReferrals")}
                  className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === "viewReferrals"
                      ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-md"
                      : "text-[#062341] hover:bg-white/50"
                  }`}
                >
                  View Referrals
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleTab("referStudent")}
                  className={`flex-1 py-2.5 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    activeTab === "referStudent"
                      ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-md"
                      : "text-[#062341] hover:bg-white/50"
                  }`}
                >
                  Refer Student
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#dfecf6] max-h-[calc(100vh-24rem)]">
              {activeTab === "referStudent" && <ReferStudent />}
              {activeTab === "viewReferrals" && <ViewReferrals />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherReferral;
