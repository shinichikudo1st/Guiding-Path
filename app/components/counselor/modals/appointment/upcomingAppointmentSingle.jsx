import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoClose,
  IoLocationOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { BsChatQuoteFill } from "react-icons/bs";

const UpcomingAppointmentSingle = ({ closeButton, appointment }) => {
  const location =
    appointment.counsel_type === "virtual"
      ? "Google Meet"
      : "CTU-MAIN Admin Building Room 301A";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-[95%] max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4 relative">
          <h2 className="text-white text-xl font-semibold">
            Appointment Details
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={closeButton}
            className="absolute right-4 top-4 text-white/90 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </motion.button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-16rem)]">
          {/* Student Information */}
          <div className="flex items-center gap-4">
            <Image
              priority
              alt="profile picture"
              src={appointment.student.student.profilePicture}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-[#0B6EC9]"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#062341]">
                {appointment.student.student.name}
              </h3>
              <p className="text-sm text-[#062341]/70">
                {appointment.student.student.email}
              </p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#062341]/80">
                <IoCalendarOutline className="text-[#0B6EC9] text-xl" />
                <span className="font-medium">{appointment.date_time}</span>
              </div>
              <div className="flex items-center gap-3 text-[#062341]/80">
                <IoLocationOutline className="text-[#0B6EC9] text-xl" />
                <span>{location}</span>
              </div>
              <div className="flex items-start gap-3 text-[#062341]/80">
                <IoDocumentTextOutline className="text-[#0B6EC9] text-xl mt-0.5" />
                <span>{appointment.reason}</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <h3 className="font-semibold mb-2 text-[#062341] flex items-center gap-2">
              <BsChatQuoteFill className="text-[#0B6EC9]" /> Notes:
            </h3>
            <p className="text-[#062341]/80 whitespace-pre-wrap">
              {appointment.notes}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UpcomingAppointmentSingle;
