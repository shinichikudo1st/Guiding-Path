import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillBook, AiFillEye } from "react-icons/ai";
import TodayAppointmentSingle from "./todayAppointmentSingle";

const ShowAppointmentToday = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewAppointment, setViewAppointment] = useState(false);
  const [singleAppointment, setSingleAppointment] = useState(null);

  const specificAppointment = (id) => {
    const specific = appointments.find(
      (appointment) => appointment.appointment_id === id
    );

    setSingleAppointment(specific);

    setViewAppointment(true);
  };

  const closeButton = () => {
    setViewAppointment(false);
    setSingleAppointment(null);
  };

  const getAppointments = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/getAppointmentToday");
      const result = await response.json();

      setAppointments(result.appointments);

      sessionStorage.setItem(
        "appointments",
        JSON.stringify(result.appointments)
      );
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    const storedAppointment = sessionStorage.getItem("appointments");
    if (storedAppointment) {
      setAppointments(JSON.parse(storedAppointment));
    } else {
      getAppointments();
    }
  }, []);

  return (
    <>
      {viewAppointment && (
        <TodayAppointmentSingle
          closeButton={closeButton}
          appointment={singleAppointment}
        />
      )}
      <div className="absolute mt-[10%] w-[80%] h-[60%] bg-[#D8E8F6] border-[1px] border-[#062341] overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#A8B9C9]">
        {loading ? (
          <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
              Loading Requests...
            </div>
          </div>
        ) : (
          appointments &&
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="w-[100%] h-[33.3%] bg-blue-200 flex items-center border-y-[1px] border-[#062341]"
            >
              <div className="w-[15%] flex justify-center items-center h-[100%] ">
                <Image
                  alt="profilePicture"
                  src={appointment.student.student.profilePicture}
                  width={100}
                  height={100}
                  className="rounded-[999px] border-[1px] border-[#062341]"
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[30%] h-[100%]">
                <span className="font-semibold">
                  {appointment.student.student.name}
                </span>
                <span className="text-[10pt] text-[#858C92]">
                  {appointment.student.student.email}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center w-[20%] h-[100%]">
                <span className="font-bold text-[10pt] text-[#F75555]">
                  {appointment.date_time}
                </span>
              </div>
              <div className="flex justify-evenly items-center w-[35%] h-[100%]">
                <div
                  onClick={() =>
                    specificAppointment(appointment.appointment_id)
                  }
                  className="cursor-pointer flex gap-[5%] justify-center items-center text-[15pt] font-semibold hover:text-[#0B6EC9] duration-[0.3s]"
                >
                  <AiFillEye className="text-[20pt]" />
                  <span>View</span>
                </div>
                <div className="cursor-pointer flex gap-[5%] justify-center items-center text-[15pt] font-semibold hover:text-[#0B6EC9] duration-[0.3s]">
                  <AiFillBook className="text-[20pt]" />
                  <span>Set</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ShowAppointmentToday;
