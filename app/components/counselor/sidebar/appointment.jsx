import { useState } from "react";
import ShowAppointmentRequest from "../modals/showRequest";
import ShowAppointmentToday from "../modals/appointmentToday";
import ShowAppointmentUpcoming from "../modals/appointmentUpcoming";

const AppointmentCounselor = () => {
  const [request, setToggleRequest] = useState(false);
  const [today, setToggleToday] = useState(true);
  const [upcoming, setToggleUpcoming] = useState(false);

  const toggleRequest = () => {
    setToggleToday(false);
    setToggleUpcoming(false);
    setToggleRequest(true);
  };

  const toggleToday = () => {
    setToggleUpcoming(false);
    setToggleRequest(false);
    setToggleToday(true);
  };

  const toggleUpcoming = () => {
    setToggleToday(false);
    setToggleRequest(false);
    setToggleUpcoming(true);
  };

  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center px-[4%] pt-[3%] gap-[5%]">
        <div className="flex w-[100%] justify-evenly select-none">
          <span
            onClick={toggleRequest}
            className={`text-[16pt] w-[33%] ${
              !request ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-r-[3px] border-[#062341] font-bold`}
          >
            Request
          </span>
          <span
            onClick={toggleToday}
            className={`text-[16pt] w-[33%] ${
              !today ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center font-bold`}
          >
            Today
          </span>
          <span
            onClick={toggleUpcoming}
            className={`text-[16pt] w-[33%] ${
              !upcoming ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-l-[3px] border-[#062341] font-bold`}
          >
            Upcoming
          </span>
        </div>
        {request && <ShowAppointmentRequest />}
        {today && <ShowAppointmentToday />}
        {upcoming && <ShowAppointmentUpcoming />}
      </div>
    </>
  );
};

export default AppointmentCounselor;
