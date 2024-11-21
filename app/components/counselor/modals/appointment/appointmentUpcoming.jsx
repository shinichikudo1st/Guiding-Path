import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillBook, AiFillEye } from "react-icons/ai";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import UpcomingAppointmentSingle from "./upcomingAppointmentSingle";
import RescheduleAppointment from "./rescheduleModal";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const ShowAppointmentUpcoming = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleAppointment, setSingleAppointment] = useState(null);
  const [viewAppointment, setViewAppointment] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);

  const specificAppointment = (id) => {
    const specific = appointments.find(
      (appointment) => appointment.appointment_id === id
    );
    setSingleAppointment(specific);
    setViewAppointment(true);
  };

  const openRescheduleModal = (id) => {
    setRescheduleAppointmentId(id);
  };

  const closeRescheduleModal = () => {
    setRescheduleAppointmentId(null);
  };

  const handleRescheduleSuccess = () => {
    getAppointments(); // Fetch appointments again after successful reschedule
    setRescheduleAppointmentId(null); // Close the reschedule modal
  };

  const getAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getAppointments?type=${"upcoming"}&page=${currentPage}`
      );
      const result = await response.json();
      setAppointments(result.appointments);
      setTotalPages(result.totalPages === 0 ? 1 : result.totalPages);
      console.log(result.totalPages);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  const closeButton = () => {
    setViewAppointment(false);
    setSingleAppointment(null);
  };

  useEffect(() => {
    getAppointments();
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

  return (
    <>
      {viewAppointment && (
        <UpcomingAppointmentSingle
          closeButton={closeButton}
          appointment={singleAppointment}
        />
      )}
      {rescheduleAppointmentId && (
        <RescheduleAppointment
          appointmentId={rescheduleAppointmentId}
          onClose={closeRescheduleModal}
          onSuccess={handleRescheduleSuccess}
        />
      )}
      <div className="bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
        <div className="min-h-[60vh] flex flex-col justify-between">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
              <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
                Loading Appointments...
              </p>
            </div>
          ) : (
            <>
              <div className="flex-grow">
                {appointments.length > 0 ? (
                  <div className="space-y-4 p-6">
                    {appointments.map((appointment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5 max-w-4xl mx-auto"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            alt="Profile Picture"
                            src={appointment.student.student.profilePicture}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-[#0B6EC9]"
                          />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                          <h3 className="text-base font-semibold text-[#062341]">
                            {appointment.student.student.name}
                          </h3>
                          <p className="text-xs text-[#062341]/70">
                            {appointment.student.student.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <p className="text-xs font-medium text-red-600 bg-red-100 px-2.5 py-1 rounded-full text-center">
                            {appointment.date_time}
                          </p>
                          <div className="flex justify-center gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                specificAppointment(appointment.appointment_id)
                              }
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-[#0B6EC9] bg-[#0B6EC9]/10 rounded-full hover:bg-[#0B6EC9]/20 transition-all duration-300"
                            >
                              <AiFillEye className="mr-1 text-sm" />
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                openRescheduleModal(appointment.appointment_id)
                              }
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-all duration-300"
                            >
                              <AiFillBook className="mr-1 text-sm" />
                              Reschedule
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                      <p className="text-xl font-semibold text-[#062341]">
                        No upcoming appointments
                      </p>
                      <p className="text-sm text-[#062341]/70 mt-2">
                        Check back later or schedule new appointments
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border-t border-[#0B6EC9]/10 p-3 mt-auto">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#062341]/70">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                    >
                      <IoChevronBackOutline className="w-4 h-4 text-[#062341]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                    >
                      <IoChevronForwardOutline className="w-4 h-4 text-[#062341]" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAppointmentUpcoming;
