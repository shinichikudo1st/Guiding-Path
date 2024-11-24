import { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLink,
  FaSpinner,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

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
        onRegister(event.event_id);
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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-[95%] max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4 relative">
          <h2 className="text-white text-xl font-semibold">
            Event Registration
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

        <div className="flex-grow overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-16rem)]">
          <h3 className="text-xl font-semibold text-[#062341]">
            {event.title}
          </h3>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10 space-y-4">
            <div className="flex items-center gap-2 text-[#062341]/80">
              <FaCalendarAlt className="text-[#0B6EC9]" />
              <span>
                {new Date(event.date_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 text-[#062341]/80">
                <FaMapMarkerAlt className="text-[#0B6EC9]" />
                <span>{event.location}</span>
              </div>
            )}

            {event.attendees && (
              <div className="flex items-center gap-2 text-[#062341]/80">
                <FaUserFriends className="text-[#0B6EC9]" />
                <span>{event.attendees} attending</span>
              </div>
            )}
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <p className="text-[#062341]/80">{event.description}</p>
          </div>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#0B6EC9] hover:text-[#095396] transition-colors"
            >
              <FaLink />
              <span>Event Link</span>
            </a>
          )}
        </div>

        <div className="p-4 bg-white border-t border-[#0B6EC9]/10">
          {registrationStatus === "success" ? (
            <div className="text-center text-green-600 font-medium">
              Registration Successful!
            </div>
          ) : registrationStatus === "error" ? (
            <div className="text-center text-red-600 font-medium">
              Registration Failed. Please try again.
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white py-2 px-4 rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>Confirm Registration</>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterEvent;
