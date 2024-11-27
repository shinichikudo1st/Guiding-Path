import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserCircle,
  FaEnvelope,
  FaInfoCircle,
  FaVideo,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const StudentQuickView = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleQuickView = () => {
    setIsQuickViewOpen(!isQuickViewOpen);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Mobile toggle button
  const ToggleButton = () => (
    <button
      onClick={toggleQuickView}
      className="fixed right-4 top-24 z-50 p-3 rounded-xl bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-lg md:hidden"
    >
      {isQuickViewOpen ? <FaTimes /> : <FaBars />}
    </button>
  );

  return (
    <>
      <ToggleButton />
      <AnimatePresence>
        {(isQuickViewOpen || isDesktop) && (
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg z-40
              ${isQuickViewOpen ? "block" : "hidden md:block"}`}
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
                onClick={() =>
                  window.innerWidth < 768 && setIsQuickViewOpen(false)
                }
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-3 shadow-md">
                  <FaClock className="text-2xl text-white" />
                </div>

                <h2 className="text-lg font-semibold text-[#062341] text-center mb-4">
                  Scheduled Appointment
                </h2>

                <div className="w-full">
                  <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg border border-[#0B6EC9]/10 hover:bg-white/80 transition-all duration-300">
                    {appointment.counselor.counselor.profilePicture ? (
                      <img
                        src={appointment.counselor.counselor.profilePicture}
                        alt="Counselor"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0B6EC9]/20"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-[#0B6EC9]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#062341] truncate">
                        {appointment.counselor.counselor.name}
                      </p>
                      <div className="flex items-center text-sm text-[#062341]/70 gap-1.5">
                        <FaEnvelope className="text-[#0B6EC9] flex-shrink-0 w-3.5 h-3.5" />
                        <span className="truncate">
                          {appointment.counselor.counselor.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.counsel_type === "virtual" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      window.open(
                        "https://meet.google.com/dcv-iuva-bni",
                        "_blank"
                      )
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
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentQuickView;
