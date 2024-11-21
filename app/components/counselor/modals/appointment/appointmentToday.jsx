import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillBook, AiFillEye } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import TodayAppointmentSingle from "./todayAppointmentSingle";
import { motion } from "framer-motion";

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
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      {viewAppointment && (
        <TodayAppointmentSingle
          closeButton={closeButton}
          appointment={singleAppointment}
        />
      )}
      <div className="bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
            <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
              Loading Appointments...
            </p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4 p-6">
            {appointments.map((appointment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5"
              >
                <div className="flex-shrink-0">
                  <Image
                    alt="Profile Picture"
                    src={appointment.student.student.profilePicture}
                    width={56}
                    height={56}
                    className="rounded-full object-cover border-2 border-[#0B6EC9]"
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-[#062341]">
                    {appointment.student.student.name}
                  </h3>
                  <p className="text-sm text-[#062341]/70">
                    {appointment.student.student.email}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <p className="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full text-center">
                    {appointment.date_time}
                  </p>
                  <div className="flex justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        specificAppointment(appointment.appointment_id)
                      }
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#0B6EC9] bg-[#0B6EC9]/10 rounded-full hover:bg-[#0B6EC9]/20 transition-all duration-300"
                    >
                      <AiFillEye className="mr-1" />
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-all duration-300"
                    >
                      <AiFillBook className="mr-1" />
                      Set
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <p className="text-xl font-semibold text-[#062341]">
                No appointments for today
              </p>
              <p className="text-sm text-[#062341]/70 mt-2">
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
