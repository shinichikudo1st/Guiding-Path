import Image from "next/image";
import {
  IoClose,
  IoLocationOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AppointmentSingleDashboard = ({ closeButton, appointment }) => {
  const location =
    appointment.counsel_type === "virtual"
      ? "Google Meet"
      : "CTU-MAIN Admin Building Room 301A";

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 w-[95%] max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6 relative">
          <h2 className="text-2xl font-bold text-white text-center">
            Appointment Details
          </h2>
          <button
            onClick={closeButton}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          {/* Student Information */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-[#0B6EC9]/10">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                {appointment.student.student.profilePicture ? (
                  <Image
                    alt="profilePicture"
                    src={appointment.student.student.profilePicture}
                    height={80}
                    width={80}
                    className="rounded-full border-2 border-[#0B6EC9]/20"
                  />
                ) : (
                  <FaUserCircle className="text-[#0B6EC9] w-20 h-20" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#062341] mb-1">
                  {appointment.student.student.name}
                </h3>
                <p className="text-[#062341]/70 text-sm">
                  {appointment.student.student.email}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-[#0B6EC9]/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B6EC9]/10 rounded-lg flex items-center justify-center">
                  <IoCalendarOutline className="text-[#0B6EC9] text-xl" />
                </div>
                <div>
                  <p className="text-sm text-[#062341]/70">Date & Time</p>
                  <p className="font-semibold text-[#062341]">
                    {appointment.date_time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B6EC9]/10 rounded-lg flex items-center justify-center">
                  <IoLocationOutline className="text-[#0B6EC9] text-xl" />
                </div>
                <div>
                  <p className="text-sm text-[#062341]/70">Location</p>
                  <p className="font-semibold text-[#062341]">{location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#0B6EC9]/10 rounded-lg flex items-center justify-center">
                  <IoDocumentTextOutline className="text-[#0B6EC9] text-xl" />
                </div>
                <div>
                  <p className="text-sm text-[#062341]/70">Reason</p>
                  <p className="font-semibold text-[#062341]">
                    {appointment.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#0B6EC9]/10">
              <h3 className="text-lg font-semibold text-[#062341] mb-4">
                Additional Notes
              </h3>
              <p className="text-[#062341]/70 whitespace-pre-wrap text-sm">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentSingleDashboard;
