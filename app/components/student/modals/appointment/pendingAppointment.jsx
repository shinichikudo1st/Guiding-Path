import Image from "next/image";
import { useEffect, useState } from "react";
import { encrypt, decrypt } from "@/app/utils/security";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";

const PendingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  const retrievePendingAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pendingAppointments");
      const result = await response.json();

      console.log(result.message);
      setAppointments(result.appointment);
      console.log(result.appointment);

    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    retrievePendingAppointments();
  }, []);

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);

    try {
      const response = await fetch(`/api/cancelAppointment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedAppointmentId }),
      });

      if (response.ok) {
        setStatusMessage({
          type: "success",
          message: "Appointment cancelled successfully",
        });
        retrievePendingAppointments();
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      } else {
        setStatusMessage({
          type: "error",
          message: "Failed to cancel appointment",
        });
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setStatusMessage({
        type: "error",
        message: "An error occurred while cancelling the appointment",
      });
    } finally {
      setCancelLoading(false);
      setShowConfirmModal(false);
      setSelectedAppointmentId(null);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
          <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
            Loading Appointments...
          </p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="overflow-y-auto max-h-[calc(100vh-16rem)] space-y-4 p-6 scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#0B6EC9]/40">
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.appointment_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5 overflow-hidden max-w-4xl mx-auto"
            >
              <div className="flex-grow p-3">
                <div className="flex items-center gap-3">
                  <Image
                    priority
                    alt="counselor picture"
                    src={appointment.counselor.counselor.profilePicture}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-[#0B6EC9]"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-[#062341]">
                      {appointment.counselor.counselor.name}
                    </h3>
                    <p className="text-xs text-[#062341]/70">
                      {appointment.counselor.counselor.contact}
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#0B6EC9]/10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                      <FaCalendarAlt className="text-[#0B6EC9] text-base" />
                      <span>
                        {appointment.date_time}
                        {new Date(appointment.raw_date).toDateString() ===
                          new Date().toDateString() && (
                          <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                      <FaMapMarkerAlt className="text-[#0B6EC9] text-base" />
                      <span>CTU-Admin Room 301A</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                      <FaClipboardList className="text-[#0B6EC9] text-base" />
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 p-3 bg-gradient-to-br from-[#0B6EC9] to-[#095396] text-white sm:w-48">
                <p className="text-center text-sm font-medium">
                  Please wait for the schedule
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCancelClick(appointment.appointment_id)}
                  className="w-full px-3 py-1.5 bg-white text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <FaTimes className="text-xs" />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <FaClipboardList className="mx-auto text-4xl text-[#0B6EC9]/40 mb-2" />
            <p className="text-xl font-semibold text-[#062341]">
              No pending appointments
            </p>
            <p className="text-sm text-[#062341]/70 mt-2">
              Check back later for new requests
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-4">
              Cancel Appointment
            </h3>
            <p className="text-[#062341]/70 mb-6">
              Are you sure you want to cancel this appointment?
            </p>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-[#062341]/70 hover:text-[#062341] font-medium rounded-lg hover:bg-[#F8FAFC] transition-all duration-300"
                disabled={cancelLoading}
              >
                No, Keep it
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>Yes, Cancel</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Status Message */}
      {statusMessage.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`m-4 p-3 rounded-lg text-sm ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.message}
        </motion.div>
      )}
    </div>
  );
};

export default PendingAppointment;
