import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserCircle,
  FaEnvelope,
  FaInfoCircle,
  FaVideo,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const StudentQuickView = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getStudentAppointmentToday");
      if (!response.ok) {
        throw new Error("Failed to fetch appointment");
      }
      const data = await response.json();
      setAppointment(data.appointment[0] || null);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      setError("Unable to load appointment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg md:translate-x-0 transition-transform duration-300 translate-x-full sm:translate-x-0"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-bold text-[#062341] mb-4 flex items-center"
      >
        <FaCalendarAlt className="mr-2 text-[#0B6EC9]" />
        Today's Schedule
      </motion.h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-40"
        >
          <div className="w-12 h-12 border-4 border-[#0B6EC9]/20 border-t-[#0B6EC9] rounded-full animate-spin" />
        </motion.div>
      ) : error ? (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center border border-red-200"
        >
          <FaInfoCircle className="text-3xl text-red-500 mb-2" />
          <p className="text-red-600 text-center">{error}</p>
        </motion.div>
      ) : appointment ? (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center border border-[#0B6EC9]/5"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-3 shadow-md">
            <FaClock className="text-2xl text-white" />
          </div>

          <h2 className="text-lg font-semibold text-[#062341] text-center mb-4">
            Scheduled Appointment
          </h2>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              {appointment.counselor.counselor.profilePicture ? (
                <img
                  src={appointment.counselor.counselor.profilePicture}
                  alt="Counselor"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0B6EC9]/10"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-[#0B6EC9]" />
              )}
              <div>
                <p className="font-semibold text-[#062341]">
                  {appointment.counselor.counselor.name}
                </p>
                <p className="text-sm text-[#062341]/70 flex items-center gap-1">
                  <FaEnvelope className="text-[#0B6EC9]" />
                  {appointment.counselor.counselor.email}
                </p>
              </div>
            </div>

            {appointment.counsel_type === "virtual" ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  window.open("https://meet.google.com/dcv-iuva-bni", "_blank")
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300"
              >
                <FaVideo />
                Join Meeting
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 text-[#062341]/70">
                <FaMapMarkerAlt className="text-[#0B6EC9]" />
                <span className="text-sm">Admin Building Room 301A</span>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center border border-[#0B6EC9]/5"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-3 shadow-md opacity-50">
            <FaCalendarAlt className="text-2xl text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#062341] text-center">
            No Appointments
          </h3>
          <p className="text-sm text-[#062341]/70 text-center mt-2">
            You have no appointments scheduled for today.
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default StudentQuickView;
