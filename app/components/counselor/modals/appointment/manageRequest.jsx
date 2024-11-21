import Image from "next/image";
import { useState } from "react";
import ManageAppointmentDate from "./appointmentDate";
import { IoClose } from "react-icons/io5";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { MdPriorityHigh } from "react-icons/md";
import { BsChatQuoteFill } from "react-icons/bs";
import { motion } from "framer-motion";

const ManageRequest = ({
  requests,
  closeButton,
  requestID,
  initialRequests,
}) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleRejectRequest = async () => {
    try {
      const response = await fetch(`/api/deleteRequest?id=${requestID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        initialRequests();
        closeButton();
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const renderRequest = requests.find(
    (request) => request.request_id === requestID
  );

  if (openDatePicker) {
    return (
      <ManageAppointmentDate
        renderRequest={renderRequest}
        closeButton={closeButton}
        closeButtonDate={() => setOpenDatePicker(false)}
        initialRequests={initialRequests}
      />
    );
  }

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
            {renderRequest.name}
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
          <div className="flex items-center gap-4">
            <Image
              priority
              alt="profile picture"
              src={renderRequest.student.student.profilePicture}
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-[#0B6EC9]"
            />
            <div>
              <p className="text-[#062341]/80 flex items-center gap-2">
                <FaUser className="text-[#0B6EC9]" />
                {renderRequest.type}
              </p>
              <p className="text-[#062341]/80 flex items-center gap-2 mt-1">
                <MdPriorityHigh className="text-[#0B6EC9]" />
                {renderRequest.urgency} urgent
              </p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <h3 className="font-semibold mb-2 text-[#062341]">Reason:</h3>
            <p className="text-[#062341]/80">{renderRequest.reason}</p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <h3 className="font-semibold mb-2 text-[#062341] flex items-center gap-2">
              <BsChatQuoteFill className="text-[#0B6EC9]" /> Notes:
            </h3>
            <p className="text-[#062341]/80 italic">"{renderRequest.notes}"</p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#0B6EC9]/10">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenDatePicker(true)}
              className="flex-1 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white py-2 px-4 rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <FaCalendarAlt /> Accept Request
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRejectRequest}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <IoClose /> Reject Request
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageRequest;
