import { useState } from "react";
import ShowAppointmentRequest from "../modals/appointment/showRequest";
import ShowAppointmentToday from "../modals/appointment/appointmentToday";
import ShowAppointmentUpcoming from "../modals/appointment/appointmentUpcoming";

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
        <div className="flex w-[100%] justify-evenly select-none bg-white rounded-full shadow-md">
          <span
            onClick={toggleRequest}
            className={`text-[16pt] w-[33%] py-2 ${
              request ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-l-full font-bold`}
          >
            Request
          </span>
          <span
            onClick={toggleToday}
            className={`text-[16pt] w-[33%] py-2 ${
              today ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold`}
          >
            Today
          </span>
          <span
            onClick={toggleUpcoming}
            className={`text-[16pt] w-[33%] py-2 ${
              upcoming ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-r-full font-bold`}
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
