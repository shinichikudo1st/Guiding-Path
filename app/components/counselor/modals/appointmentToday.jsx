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
      const response = await fetch(
        `/api/getAppointments?type=${"today"}&page=${"none"}`
      );
      const result = await response.json();

      setAppointments(result.appointments);

      sessionStorage.setItem(
        "appointment_today",
        JSON.stringify(result.appointments)
      );
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    const storedAppointment = sessionStorage.getItem("appointment_today");
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
      <div className="absolute mt-[10%] w-[80%] h-[60%] bg-[#D8E8F6] shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 py-2 text-lg font-medium text-blue-600 bg-blue-100 rounded-full animate-pulse">
              Loading Appointments...
            </div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4 p-4">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-[#F0F7FF] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image
                    alt="Profile Picture"
                    src={appointment.student.student.profilePicture}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.student.student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.student.student.email}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    {appointment.date_time}
                  </p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() =>
                        specificAppointment(appointment.appointment_id)
                      }
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
                    >
                      <AiFillEye className="mr-1" />
                      View
                    </button>
                    <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-150">
                      <AiFillBook className="mr-1" />
                      Set
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600">
                No appointments for today
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later or schedule new appointments
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowAppointmentToday;
