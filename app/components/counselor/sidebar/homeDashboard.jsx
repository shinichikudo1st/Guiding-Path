import Image from "next/image";
import { useEffect, useState } from "react";
import AppointmentSingleDashboard from "../modals/appointmentSingleDashboard";

const CounselorHome = () => {
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
      const response = await fetch(
        `/api/getAppointments?type=${"today"}&page=${"none"}`
      );
      const result = await response.json();

      setAppointments(result.appointments);

      console.log(result.message);

      sessionStorage.setItem(
        "appointment_today_dashboard",
        JSON.stringify(result.appointments)
      );
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    const storedAppointment = sessionStorage.getItem(
      "appointment_today_dashboard"
    );
    if (storedAppointment) {
      setAppointments(JSON.parse(storedAppointment));
    } else {
      getAppointments();
    }
  }, []);

  return (
    <>
      {viewAppointment && (
        <AppointmentSingleDashboard
          closeButton={closeButton}
          appointment={singleAppointment}
        />
      )}
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center px-[4%] pt-[1%] gap-[5%]">
        <h1 className="text-[20pt] font-bold w-[100%] h-[15%] flex justify-center items-center border-b-[4px] border-[#2D6BA3]">
          Appointments Today
        </h1>
        <div className="grid grid-cols-3 w-[100%] gap-[5%] bg-[#b6d9f3] h-[60%] items-center p-[5%] overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#A8B9C9]">
          {loading ? (
            <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700 col-span-3">
              <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                Loading Appointments...
              </div>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.appointment_id}
                className="bg-[#9DC9F1] flex flex-col justify-center items-center px-[3%] py-[10%] rounded-[20px] border-[2px] border-[#177CD8]"
              >
                <Image
                  alt="profilePicture"
                  height={80}
                  width={80}
                  src={appointment.student.student.profilePicture}
                  className="h-[80px] w-[80px] bg-white rounded-[999px] border-[1px] border-[#062341]"
                />
                <div className="flex flex-col justify-center items-center mt-[10%]">
                  <span className="font-bold text-[#062341] text-[15pt]">
                    {appointment.student.student.name}
                  </span>
                  <span className="font-medium text-[#858C92] text-[10pt]">
                    {appointment.student.student.email}
                  </span>
                </div>
                <div className="font-medium text-[#F75555] text-[12pt] mt-[10%] flex flex-col items-center">
                  <span>{appointment.date_time}</span>
                  <span>
                    {appointment.counsel_type === "virtual"
                      ? "Gmeet"
                      : "Admin Building Room 3A1"}
                  </span>
                </div>
                <div
                  onClick={() =>
                    specificAppointment(appointment.appointment_id)
                  }
                  className="font-semibold text-[#087EE8] text-[12pt] mt-[10%] underline cursor-pointer"
                >
                  Manage
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CounselorHome;
