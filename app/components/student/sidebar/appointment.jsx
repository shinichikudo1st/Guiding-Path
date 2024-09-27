import { useState } from "react";
import AppointmentRequest from "../modals/appointment/appointmentRequest";
import PendingAppointment from "../modals/appointment/pendingAppointment";
import AppointmentCalendar from "../modals/appointment/appointmentCalendar";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState("request");

  const tabs = [
    { id: "appointments", label: "Appointments" },
    { id: "pending", label: "Pending Appointments" },
    { id: "request", label: "Submit Request" },
  ];

  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col pt-[2%] items-center">
        <div className="flex w-[80%] justify-evenly select-none">
          {tabs.map((tab) => (
            <span
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[16pt] w-[33%] cursor-pointer transition-all duration-300 ease-in-out text-center font-bold
                ${activeTab === tab.id ? "text-[#0B6EC9]" : "text-[#818487]"}
                hover:text-[#0B6EC9] hover:text-[17pt]
                relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[3px] after:bg-[#0B6EC9]
                after:transform after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out
                ${activeTab === tab.id ? "after:scale-x-100" : ""}
              `}
            >
              {tab.label}
            </span>
          ))}
        </div>
        {activeTab === "request" && <AppointmentRequest />}
        {activeTab === "pending" && <PendingAppointment />}
        {activeTab === "appointments" && <AppointmentCalendar />}
      </div>
    </>
  );
};

export default Appointment;
