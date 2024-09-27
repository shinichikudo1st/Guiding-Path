import Image from "next/image";
import { useEffect, useState } from "react";
import { encrypt, decrypt } from "@/app/utils/security";
import AppointmentSingleDashboard from "../modals/appointment/appointmentSingleDashboard";
import {
  FaUserCircle,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaEye,
  FaVideo,
} from "react-icons/fa";

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

      const encryptedAppointments = encrypt(result.appointments);

      if (encryptedAppointments) {
        sessionStorage.setItem(
          "appointment_today_dashboard",
          encryptedAppointments
        );
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    const storedAppointment = sessionStorage.getItem(
      "appointment_today_dashboard"
    );
    if (storedAppointment) {
      const decryptedAppointments = decrypt(storedAppointment);
      if (decryptedAppointments) {
        setAppointments(decryptedAppointments);
      } else {
        getAppointments();
      }
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
        <h1 className="text-[24pt] font-bold w-[100%] h-[15%] flex justify-center items-center border-b-[4px] border-[#2D6BA3]">
          Today's Appointments
        </h1>
        <div className="appointmentContainer w-[100%] h-[75%] bg-[#c1d9ec] p-6 overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#A8B9C9] rounded-lg shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="px-6 py-3 text-lg font-medium text-white bg-[#0B6EC9] rounded-full animate-pulse shadow-md">
                Loading Appointments...
              </div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-xl text-[#2D6BA3] font-semibold">
                No appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.appointment_id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-[#0B6EC9] to-[#2D6BA3] p-4 text-white">
                    <div className="flex items-center space-x-3">
                      {appointment.student.student.profilePicture ? (
                        <Image
                          src={appointment.student.student.profilePicture}
                          alt={`${appointment.student.student.name}'s profile`}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <FaUserCircle className="text-5xl" />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">
                          {appointment.student.student.name}
                        </h3>
                        <div className="flex items-center text-sm">
                          <FaEnvelope className="mr-1" />
                          {appointment.student.student.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center text-[#2D6BA3]">
                      <FaClock className="mr-2 text-lg" />
                      <span className="font-medium">
                        {appointment.date_time}
                      </span>
                    </div>
                    <div className="flex items-center text-[#2D6BA3]">
                      <FaMapMarkerAlt className="mr-2 text-lg" />
                      <span className="font-medium">
                        {appointment.counsel_type === "virtual"
                          ? "Google Meet"
                          : "Admin Building Room 3A1"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        specificAppointment(appointment.appointment_id)
                      }
                      className="w-full mt-2 bg-[#0B6EC9] hover:bg-[#2D6BA3] text-white py-2 px-4 rounded-full transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                    {appointment.counsel_type === "virtual" && (
                      <a
                        href="https://meet.google.com/dcv-iuva-bni"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 px-4 rounded-full transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <FaVideo className="mr-2" />
                        Join Meeting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CounselorHome;
