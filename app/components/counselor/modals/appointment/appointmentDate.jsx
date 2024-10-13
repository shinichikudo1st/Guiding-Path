import { useState } from "react";
import { motion } from "framer-motion";
import AvailableAppointmentSlot from "./availableAppointmentSlot";

const ManageAppointmentDate = ({
  renderRequest,
  closeButton,
  closeButtonDate,
  initialRequests,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSlot = (dateTime) => {
    setSelectedDateTime(dateTime);
    setError(null);
  };

  const acceptRequest = async () => {
    if (!selectedDateTime) {
      setError("Please select an appointment slot");
      return;
    }

    setIsLoading(true);

    const data = {
      date: selectedDateTime.toISOString(),
      id: renderRequest.student_id,
      role: renderRequest.role,
      notes: renderRequest.notes,
      reason: renderRequest.reason,
      counsel_type: renderRequest.type,
    };

    try {
      const response = await fetch("/api/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      await fetch(`/api/deleteRequest?id=${renderRequest.request_id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      console.log(result.message);
      initialRequests();
      closeButton();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-[20px] z-50"
    >
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule Appointment
          </h2>
          <button
            onClick={closeButtonDate}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <AvailableAppointmentSlot onSelectSlot={handleSelectSlot} />
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <button
            onClick={acceptRequest}
            disabled={isLoading || !selectedDateTime}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Scheduling..." : "Schedule Appointment"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageAppointmentDate;
