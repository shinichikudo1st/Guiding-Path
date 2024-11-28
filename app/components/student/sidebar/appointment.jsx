import { useState } from "react";
import AppointmentRequest from "../modals/appointment/appointmentRequest";
import PendingAppointment from "../modals/appointment/pendingAppointment";
import AppointmentCalendar from "../modals/appointment/appointmentCalendar";
import { motion } from "framer-motion";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState("request");

  const tabs = [
    { id: "appointments", label: "Calendar" },
    { id: "pending", label: "Pending" },
    { id: "request", label: "Request" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 md:pt-24 pb-8 px-4 md:px-6 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto lg:ml-72 lg:mr-72 2xl:mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4 md:p-8 text-white">
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Appointments
            </h1>
          </div>

          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="flex w-full justify-evenly select-none bg-white rounded-full shadow-md">
              {tabs.map((tab) => (
                <span
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm md:text-base w-1/3 py-2.5 md:py-3 ${
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
