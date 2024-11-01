import { useState } from "react";
import AvailableAppointmentSlot from "./availableAppointmentSlot";

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
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full relative z-10">
        <h2 className="text-2xl font-semibold mb-6">Reschedule Appointment</h2>
        <AvailableAppointmentSlot onSelectSlot={handleSelectSlot} />
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !selectedDateTime}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;
