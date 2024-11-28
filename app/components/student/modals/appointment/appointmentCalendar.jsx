import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoDocumentTextOutline } from "react-icons/io5";

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [yearInput, setYearInput] = useState("");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".calendar-container")) {
        setShowYearSelector(false);
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const monthString = `${year}-${month}`;

    try {
      const response = await fetch(
        `/api/getStudentAppointments?month=${monthString}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.appointments);
        setAppointments(data.appointments);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const changeYear = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearSelector(false);
    setYearInput("");
  };

  const changeMonth = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const handleYearInputChange = (e) => {
    setYearInput(e.target.value);
  };

  const handleYearInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const year = parseInt(yearInput, 10);
      if (!isNaN(year) && year > 0) {
        changeYear(year);
      }
    }
  };

  const selectDate = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);

    const appointmentsOnDay = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    if (appointmentsOnDay.length > 0) {
      setSelectedAppointments(appointmentsOnDay);
      setShowAppointmentModal(true);
    } else {
      setSelectedAppointments([]);
      setShowAppointmentModal(false);
    }
  };

  const hasAppointment = (date) => {
    return appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.date_time);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isPastAppointment = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const AppointmentModal = ({ appointments, onClose }) => {
    const getStatusColor = (status) => {
      if (!status) return "bg-gray-100 text-gray-700 border-gray-200";

      switch (status.toString().toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "closed":
          return "bg-green-100 text-green-700 border-green-200";
        case "cancelled":
          return "bg-red-100 text-red-700 border-red-200";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    const formatDateTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${formattedDate} at ${formattedTime}`;
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-[#0B6EC9]/10 flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold text-[#062341]">
              Appointments for{" "}
              {new Date(appointments[0]?.date_time).toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                }
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-[#062341]/70 hover:text-[#062341] transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-8rem)] p-4 md:p-6 space-y-4">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#0B6EC9]/10 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Image
                      priority
                      alt="counselor picture"
                      src={appointment.counselor.counselor.profilePicture}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-[#0B6EC9]"
                    />
                    <div>
                      <h3 className="text-base font-semibold text-[#062341]">
                        {appointment.counselor.counselor.name}
                      </h3>
                      <p className="text-sm text-[#062341]/70">
                        {appointment.counselor.counselor.contact}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "Unknown"}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#062341]/80">
                    <FaCalendarAlt className="text-[#0B6EC9] text-base flex-shrink-0" />
                    <span>{formatDateTime(appointment.date_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#062341]/80">
                    <FaMapMarkerAlt className="text-[#0B6EC9] text-base flex-shrink-0" />
                    <span>CTU-Admin Room 301A</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#062341]/80">
                    <IoDocumentTextOutline className="text-[#0B6EC9] text-base mt-0.5 flex-shrink-0" />
                    <p>{appointment.reason}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
      <div className="calendar-container p-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="text-[#0B6EC9] hover:text-[#094a86] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-full p-2"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-base font-semibold text-[#062341] bg-white rounded-xl border border-[#0B6EC9]/10 hover:bg-[#F8FAFC] transition-all duration-300"
              >
                {months[currentDate.getMonth()]}
                <FaChevronDown className="h-3.5 w-3.5 text-[#0B6EC9]" />
              </motion.button>
              {showMonthDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-[#0B6EC9]/10 p-2 z-10 w-48 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent"
                >
                  {months.map((month, index) => (
                    <motion.div
                      key={month}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer px-3 py-2 rounded-lg font-medium text-[#062341] hover:bg-[#0B6EC9]/10 transition-all duration-300"
                      onClick={() => changeMonth(index)}
                    >
                      {month}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowYearSelector(!showYearSelector)}
                className="flex items-center gap-2 px-3 py-1.5 text-base font-semibold text-[#062341] bg-white rounded-xl border border-[#0B6EC9]/10 hover:bg-[#F8FAFC] transition-all duration-300"
              >
                {currentDate.getFullYear()}
                <FaChevronDown className="h-3.5 w-3.5 text-[#0B6EC9]" />
              </motion.button>
              {showYearSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-[#0B6EC9]/10 p-3 z-10 w-56"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={yearInput}
                      onChange={handleYearInputChange}
                      onKeyDown={handleYearInputKeyDown}
                      placeholder="Enter year..."
                      className="w-full px-3 py-1.5 text-base font-medium text-[#062341] bg-[#F8FAFC] rounded-lg border border-[#0B6EC9]/10 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20 transition-all duration-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowYearSelector(false)}
                      className="p-1.5 rounded-lg text-[#062341]/70 hover:bg-[#0B6EC9]/10 transition-all duration-300"
                    >
                      <FaTimes className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent">
                    {Array.from(
                      { length: 10 },
                      (_, i) => currentDate.getFullYear() - 5 + i
                    ).map((year) => (
                      <motion.div
                        key={year}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer px-3 py-1.5 rounded-lg font-medium text-[#062341] hover:bg-[#0B6EC9]/10 transition-all duration-300 text-center"
                        onClick={() => changeYear(year)}
                      >
                        {year}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <button
            onClick={nextMonth}
            className="text-[#0B6EC9] hover:text-[#094a86] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-full p-2"
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekdays.map((day, index) => (
            <div
              key={day}
              className={`text-center font-bold text-sm ${
                index === 0 ? "text-red-600" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
          {Array(firstDayOfMonth)
            .fill(null)
            .map((_, index) => (
              <div key={`empty-${index}`}></div>
            ))}
          {days.map((day) => {
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const isSunday = date.getDay() === 0;
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasAppointmentOnDay = hasAppointment(date);
            const isPast = isPastAppointment(date);
            return (
              <div
                key={day}
                className={`h-10 flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out rounded-full
                  ${isSunday ? "text-red-600" : ""}
                  ${
                    isSelected
                      ? "bg-[#0B6EC9] text-white shadow-md transform scale-110"
                      : hasAppointmentOnDay
                      ? isPast
                        ? "bg-gray-400 text-white"
                        : "bg-green-500 text-white shadow-sm hover:shadow-md hover:transform hover:scale-105"
                      : "hover:bg-[#E6F0F9] hover:shadow-sm"
                  }
                  ${isToday ? "border-2 border-[#0B6EC9]" : ""}
                `}
                onClick={() => selectDate(day)}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#062341]/70">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span>Past Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Upcoming Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#0B6EC9]"></div>
            <span>Today</span>
          </div>
        </div>

        {selectedDate && (
          <div className="mt-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
            <div className="flex items-center gap-3 text-[#062341]/80">
              <FaCalendarAlt className="text-[#0B6EC9] text-xl" />
              <span className="font-medium">
                Selected Date: {selectedDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {showAppointmentModal && (
        <AppointmentModal
          appointments={selectedAppointments}
          onClose={() => setShowAppointmentModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
