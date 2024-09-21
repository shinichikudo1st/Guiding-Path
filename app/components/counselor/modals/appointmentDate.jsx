import { useState } from "react";
import { motion } from "framer-motion";

const ManageAppointmentDate = ({
  renderRequest,
  closeButton,
  closeButtonDate,
  initialRequests,
}) => {
  const [date, setDate] = useState(null);

  const onChangeHandler = (event) => {
    setDate(event.target.value);
  };

  const acceptRequest = async () => {
    if (!date) {
      return;
    }

    const data = {
      date: date,
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

      await fetch(`/api/deleteRequest?id=${renderRequest.request_id}`, {
        method: "DELETE",
      });

      const result = response.json();
      console.log(result.message);
    } catch (error) {}

    initialRequests();
    closeButton();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-[20px] z-50"
    >
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
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
          <div className="mb-6">
            <label
              htmlFor="appointment-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pick an appointment date:
            </label>
            <input
              id="appointment-date"
              onChange={onChangeHandler}
              type="datetime-local"
              className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={acceptRequest}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Schedule Appointment
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageAppointmentDate;
