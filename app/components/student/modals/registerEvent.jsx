import { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLink,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const RegisterEvent = ({ event, onClose, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: event.event_id }),
      });

      if (response.ok) {
        setRegistrationStatus("success");
        onRegister(event.event_id); // Call the onRegister callback with the event ID
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        const errorData = await response.json();
        setRegistrationStatus("error");
        console.error("Registration failed:", errorData.error);
      }
    } catch (error) {
      setRegistrationStatus("error");
      console.error("Registration failed:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-80 h-screen w-screen"></div>
      <div className="relative bg-white w-full max-w-4xl mx-auto p-8 rounded-lg shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-[#0B6EC9]">
          Event Registration
        </h2>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-[#062341]">{event.title}</h3>

          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-[#0B6EC9]" />
            <p>
              {new Date(event.date_time).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {event.location && (
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2 text-[#0B6EC9]" />
              <p>{event.location}</p>
            </div>
          )}

          <p className="text-gray-700 bg-gray-100 p-4 rounded-lg">
            {event.description}
          </p>

          {event.link && (
            <div className="flex items-center text-blue-500 hover:underline">
              <FaLink className="mr-2" />
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 transition-colors duration-200"
              >
                Event Link
              </a>
            </div>
          )}

          {event.attendees && (
            <div className="flex items-center text-gray-600">
              <FaUserFriends className="mr-2 text-[#0B6EC9]" />
              <p>{event.attendees} attending</p>
            </div>
          )}

          <div className="flex justify-end mt-8">
            {registrationStatus === "success" ? (
              <div className="flex items-center text-green-500">
                <FaCheckCircle className="mr-2" />
                <span>Registration Successful!</span>
              </div>
            ) : registrationStatus === "error" ? (
              <div className="flex items-center text-red-500">
                <FaExclamationCircle className="mr-2" />
                <span>Registration Failed. Please try again.</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className={`bg-[#0B6EC9] text-white px-8 py-3 rounded-lg shadow-md hover:bg-[#062341] transition-all duration-300 text-lg font-semibold ${
                  isRegistering ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isRegistering ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Confirm Registration"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
