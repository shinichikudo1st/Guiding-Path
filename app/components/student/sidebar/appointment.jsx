import { useState } from "react";
import AppointmentRequest from "../modals/appointment/appointmentRequest";
import PendingAppointment from "../modals/appointment/pendingAppointment";
import AppointmentCalendar from "../modals/appointment/appointmentCalendar";
import { motion } from "framer-motion";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState("request");

  const tabs = [
    { id: "appointments", label: "Appointments" },
    { id: "pending", label: "Pending" },
    { id: "request", label: "Request" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Appointments
            </h1>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex w-full justify-evenly select-none bg-white rounded-full shadow-md">
              {tabs.map((tab) => (
                <span
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-base sm:text-lg w-1/3 py-3 ${
                    activeTab === tab.id
                      ? "bg-[#0B6EC9] text-white"
                      : "text-[#818487]"
                  } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold
                    ${tab.id === "appointments" && "rounded-l-full"}
                    ${tab.id === "request" && "rounded-r-full"}
                  `}
                >
                  {tab.label}
                </span>
              ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh]">
              {activeTab === "request" && <AppointmentRequest />}
              {activeTab === "pending" && <PendingAppointment />}
              {activeTab === "appointments" && <AppointmentCalendar />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Appointment;
