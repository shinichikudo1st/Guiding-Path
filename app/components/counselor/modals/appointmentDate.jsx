import { useState } from "react";
import { motion } from "framer-motion";

const ManageAppointmentDate = ({
  renderRequest,
  closeButton,
  closeButtonDate,
  initialRequests,
}) => {
  const [date, setDate] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    setDate(event.target.value);
    setError(null);
  };

  const isWeekend = (date) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const isMorningShift =
      (hours === 8 && minutes >= 0) || (hours > 8 && hours < 12);
    const isAfternoonShift =
      (hours === 13 && minutes >= 0) || (hours > 13 && hours < 17);
    return isMorningShift || isAfternoonShift;
  };

  const acceptRequest = async () => {
    if (!date) {
      setError("Please select both date and time");
      return;
    }

    const [selectedDate, selectedTime] = date.split("T");

    if (isWeekend(selectedDate)) {
      setError("Weekends are not available for appointments");
      return;
    }

    if (!isValidTime(selectedTime)) {
      setError(
        "Please select a time between 8:00 AM and 5:00 PM, excluding 12:00 PM to 1:00 PM"
      );
      return;
    }

    setIsLoading(true);

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
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <button
            onClick={acceptRequest}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Scheduling..." : "Schedule Appointment"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageAppointmentDate;
