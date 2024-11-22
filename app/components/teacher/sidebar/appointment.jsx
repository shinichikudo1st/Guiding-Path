import { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaUserGraduate,
  FaEnvelope,
  FaClipboardList,
  FaUserMd,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const TeacherAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getReferredAppointments?page=${currentPage}`
      );
      const data = await response.json();
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString, format = "long") => {
    const date = new Date(dateString);
    if (format === "short") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Referred Appointments
            </h1>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#dfecf6] max-h-[calc(100vh-20rem)]">
              {loading ? (
                <div className="flex items-center justify-center w-full h-40">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-xl font-semibold"
                  >
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    Loading Appointments...
                  </motion.div>
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Student Section with Label */}
                        <div className="flex-1 w-full">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-[#0B6EC9] bg-[#0B6EC9]/10 px-3 py-1 rounded-full">
                              Student
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative">
                              <Image
                                priority
                                alt="student profile"
                                src={appointment.student.student.profilePicture}
                                fill
                                className="rounded-full object-cover border-2 border-[#0B6EC9]"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#062341] flex items-center gap-2">
                                <FaUserGraduate className="text-[#0B6EC9]" />
                                {appointment.student.student.name}
                              </h3>
                              <p className="text-sm text-[#062341]/70 flex items-center gap-1">
                                <FaEnvelope className="text-[#0B6EC9]" />
                                {appointment.student.student.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-20 bg-[#0B6EC9]/10"></div>

                        {/* Counselor Section with Label */}
                        <div className="flex-1 w-full">
                          <div className="mb-2">
                            <span className="text-xs font-semibold text-[#0B6EC9] bg-[#0B6EC9]/10 px-3 py-1 rounded-full">
                              Counselor
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative">
                              <Image
                                priority
                                alt="counselor profile"
                                src={
                                  appointment.counselor.counselor.profilePicture
                                }
                                fill
                                className="rounded-full object-cover border-2 border-[#0B6EC9]"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#062341] flex items-center gap-2">
                                <FaUserMd className="text-[#0B6EC9]" />
                                {appointment.counselor.counselor.name}
                              </h3>
                              <p className="text-sm text-[#062341]/70 flex items-center gap-1">
                                <FaCalendarAlt className="text-[#0B6EC9]" />
                                {formatDate(appointment.date_time)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 text-center"
                >
                  <FaClipboardList className="text-4xl text-[#0B6EC9]/30 mb-4" />
                  <h3 className="text-xl font-semibold text-[#062341]">
                    No Appointments Found
                  </h3>
                  <p className="text-[#062341]/70 mt-2">
                    Check back later for new appointments
                  </p>
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {appointments.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-[#0B6EC9]/30 cursor-not-allowed"
                      : "text-[#0B6EC9] hover:bg-[#0B6EC9]/10"
                  }`}
                >
                  <IoChevronBackOutline className="text-xl" />
                </motion.button>
                <span className="text-[#062341] font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-[#0B6EC9]/30 cursor-not-allowed"
                      : "text-[#0B6EC9] hover:bg-[#0B6EC9]/10"
                  }`}
                >
                  <IoChevronForwardOutline className="text-xl" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherAppointment;
