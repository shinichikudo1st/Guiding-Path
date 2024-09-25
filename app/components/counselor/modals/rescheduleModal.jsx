import { useState } from "react";

const RescheduleAppointment = ({ appointmentId, onClose, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setError(null);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setError(null);
  };

  const formatDateTime = (date, time) => {
    return `${date}T${time}:00`;
  };

  const isWeekend = (date) => {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const isValidTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);

    // Check if time is between 8:00 AM and 11:59 AM
    const isMorningShift =
      (hours === 8 && minutes >= 0) || (hours > 8 && hours < 12);

    // Check if time is between 1:00 PM and 4:59 PM
    const isAfternoonShift =
      (hours === 13 && minutes >= 0) || (hours > 13 && hours < 17);

    return isMorningShift || isAfternoonShift;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

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
    const formattedDateTime = formatDateTime(selectedDate, selectedTime);

    try {
      const response = await fetch(`/api/rescheduleAppointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDateTime,
          id: appointmentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }

      await response.json();

      // Call onSuccess to trigger re-render of appointments
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
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative z-10">
        <h2 className="text-2xl font-semibold mb-6">Reschedule Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Time
            </label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={handleTimeChange}
              min="08:00"
              max="17:00"
              step="1800"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleAppointment;
