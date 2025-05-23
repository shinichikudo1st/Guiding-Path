import { useState } from "react";
import AvailableAppointmentSlot from "./availableAppointmentSlot";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const RescheduleAppointment = ({ appointmentId, onClose, onSuccess }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSlot = (dateTime) => {
    setSelectedDateTime(dateTime);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateTime) {
      setError("Please select an appointment slot");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/rescheduleAppointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDateTime.toISOString(),
          id: appointmentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      await response.json();
      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
            Reschedule Appointment
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute right-4 top-4 text-white/90 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </motion.button>
        </div>
        <div className="p-6">
          <AvailableAppointmentSlot onSelectSlot={handleSelectSlot} />
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading || !selectedDateTime}
            className="mt-6 w-full bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white py-2 px-4 rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaCalendarAlt className="text-sm" />
            {isLoading ? "Updating..." : "Update Appointment"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default RescheduleAppointment;
