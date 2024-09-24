import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUserCircle,
  FaEnvelope,
  FaInfoCircle,
  FaVideo,
} from "react-icons/fa";

const StudentQuickView = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getStudentAppointmentToday");
      if (!response.ok) {
        throw new Error("Failed to fetch appointment");
      }
      const data = await response.json();
      setAppointment(data.appointment[0] || null);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      setError("Unable to load appointment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <aside className="fixed right-0 top-[75px] w-[20%] h-[calc(100vh-75px)] bg-[#E6F0F9] shadow-lg p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaCalendarAlt className="mr-2 text-blue-600" />
        Today's Schedule
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 flex items-center justify-center">
          <FaInfoCircle className="mr-2" />
          {error}
        </div>
      ) : appointment ? (
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600 flex items-center">
              <FaClock className="mr-1" />
              Appointment
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {formatTime(appointment.date_time)}
            </span>
          </div>
          <div className="flex items-center mb-4">
            {appointment.counselor.counselor.profilePicture ? (
              <img
                src={appointment.counselor.counselor.profilePicture}
                alt="Counselor"
                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-white shadow"
              />
            ) : (
              <FaUserCircle className="w-16 h-16 text-gray-400 mr-4" />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">
                {appointment.counselor.counselor.name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <FaEnvelope className="mr-1" />
                {appointment.counselor.counselor.email}
              </p>
            </div>
          </div>
          {appointment.counsel_type === "virtual" ? (
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out mt-4 flex items-center justify-center"
              onClick={() =>
                window.open("https://meet.google.com/dcv-iuva-bni", "_blank")
              }
            >
              <FaVideo className="mr-2" />
              Join Meeting
            </button>
          ) : (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-700">
                Location: Admin Building Room 301A
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No appointments
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You have no appointments scheduled for today.
          </p>
        </div>
      )}
    </aside>
  );
};

export default StudentQuickView;
