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
import { motion } from "framer-motion";
import DashboardReport from "../modals/dashboardReport";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Monthly Overview
            </h1>
          </div>
          <div className="p-8 sm:p-10">
            <DashboardReport />
          </div>
        </div>
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Today's Appointments
            </h1>
          </div>

          <div className="p-8 sm:p-10">
            <div className="min-h-[60vh] max-h-[70vh] overflow-y-auto px-2 sm:px-4 scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-xl animate-pulse shadow-md">
                    Loading Appointments...
                  </div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xl text-[#062341] font-semibold">
                    No appointments scheduled for today.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.appointment_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {appointment.student.student.profilePicture ? (
                              <Image
                                src={appointment.student.student.profilePicture}
                                alt={`${appointment.student.student.name}'s profile`}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <FaUserCircle className="text-white text-4xl" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white font-bold text-lg truncate">
                              {appointment.student.student.name}
                            </h3>
                            <div className="flex items-center text-white/90 text-sm">
                              <FaEnvelope className="mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {appointment.student.student.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-[#062341]">
                            <FaClock className="mr-2 text-[#0B6EC9]" />
                            <span className="font-medium text-sm">
                              {appointment.date_time}
                            </span>
                          </div>
                          <div className="flex items-center text-[#062341]">
                            <FaMapMarkerAlt className="mr-2 text-[#0B6EC9]" />
                            <span className="font-medium text-sm">
                              {appointment.counsel_type === "virtual"
                                ? "Google Meet"
                                : "Admin Building Room 3A1"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              specificAppointment(appointment.appointment_id)
                            }
                            className="w-full bg-gradient-to-r from-[#0B6EC9] to-[#095396] hover:from-[#095396] hover:to-[#084B87] text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                          >
                            <FaEye className="mr-2" />
                            View Details
                          </motion.button>

                          {appointment.counsel_type === "virtual" && (
                            <motion.a
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              href="https://meet.google.com/dcv-iuva-bni"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-sm"
                            >
                              <FaVideo className="mr-2" />
                              Join Meeting
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {viewAppointment && (
          <AppointmentSingleDashboard
            closeButton={closeButton}
            appointment={singleAppointment}
          />
        )}
      </div>
    </motion.div>
  );
};

export default CounselorHome;
