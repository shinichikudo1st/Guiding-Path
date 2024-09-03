import { useState } from "react";
import AppointmentRequest from "../modals/appointmentRequest";

const Appointment = () => {
  const [openRequest, setOpenRequest] = useState(true);
  const [openAppointments, setOpenAppointments] = useState(false);
  const [openPending, setOpenPending] = useState(false);

  const toggleSubmitRequest = () => {
    setOpenRequest(true);
    setOpenAppointments(false);
    setOpenPending(false);
  };

  const toggleAppointment = () => {
    setOpenAppointments(true);
    setOpenRequest(false);
    setOpenPending(false);
  };

  const togglePending = () => {
    setOpenPending(true);
    setOpenAppointments(false);
    setOpenRequest(false);
  };

  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col pt-[2%] items-center">
        <div className="flex w-[80%] justify-evenly select-none">
          <span
            onClick={toggleAppointment}
            className={`text-[16pt] w-[33%] ${
              !openAppointments ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-r-[3px] border-[#062341] font-bold`}
          >
            Appointments
          </span>
          <span
            onClick={togglePending}
            className={`text-[16pt] w-[33%] ${
              !openPending ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-r-[3px] border-[#062341] font-bold`}
          >
            Pending Appointments
          </span>
          <span
            onClick={toggleSubmitRequest}
            className={`text-[16pt] w-[33%] ${
              !openRequest ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-r-[3px] border-[#062341] font-bold`}
          >
            Submit Request
          </span>
        </div>
        {openRequest && <AppointmentRequest />}
      </div>
    </>
  );
};

export default Appointment;
