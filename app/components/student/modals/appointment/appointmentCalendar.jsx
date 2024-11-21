import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import Image from "next/image";

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
    if (!appointments || appointments.length === 0) return null;

    const formatDate = (date) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatTime = (date) => {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 rounded-[20px] flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-xl w-[90%] p-4 relative max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#D8E8F6]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold mb-4 text-[#062341]">
            Appointments for {formatDate(new Date(appointments[0].date_time))}
          </h2>

          <div className="space-y-4">
            {appointments.map((appointment, index) => {
              const appointmentDate = new Date(appointment.date_time);
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-[#0B6EC9]">
                      <Image
                        src={
                          appointment.counselor.counselor.profilePicture ||
                          "/default-profile.png"
                        }
                        alt="Counselor"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-base text-[#062341]">
                        {appointment.counselor.counselor.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {appointment.counselor.counselor.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#E6F0F9] p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaClock className="text-[#0B6EC9] mr-2 text-sm" />
                      <p className="font-semibold text-sm">
                        {formatTime(appointmentDate)}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <FaInfoCircle className="text-[#0B6EC9] mr-2 mt-1 text-sm" />
                      <p className="text-sm">
                        <span className="font-semibold">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-[#0B6EC9] text-white px-4 py-2 rounded-lg hover:bg-[#094a86] transition-colors font-semibold text-base shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute flex flex-col w-[90%] h-[80%] bg-[#E6F0F9] border-[1px] border-[#062341] mt-[6%] items-center justify-center p-8 rounded-lg shadow-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6 xl:w-[100%] xl:h-[100%] 2xl:w-[80%] 2xl:h-[80%] calendar-container">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Upcoming Appointment</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-sm">Past Appointment</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="text-[#0B6EC9] hover:text-[#094a86] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-full p-2"
          >
            <FaChevronLeft className="xl:h-4 xl:w-4 2xl:h-6 2xl:w-6" />
          </button>
          <div className="flex flex-col items-center relative">
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="xl:text-lg 2xl:text-2xl font-extrabold text-[#062341] cursor-pointer bg-transparent border-none appearance-none pr-8 flex items-center focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-lg p-2"
                >
                  {months[currentDate.getMonth()]}
                  <FaChevronDown className="xl:h-4 xl:w-4 xl:ml-1 2xl:h-5 2xl:w-5 2xl:ml-2" />
                </button>
                {showMonthDropdown && (
                  <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {months.map((month, index) => (
                      <div
                        key={month}
                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#0B6EC9] hover:text-white ${
                          currentDate.getMonth() === index
                            ? "bg-[#E6F0F9] text-[#0B6EC9]"
                            : "text-gray-900"
                        }`}
                        onClick={() => changeMonth(index)}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <h2
                className="xl:text-lg 2xl:text-2xl font-extrabold text-[#062341] cursor-pointer ml-2 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-lg p-2"
                onClick={() => setShowYearSelector(!showYearSelector)}
              >
                {currentDate.getFullYear()}
              </h2>
            </div>
            {showYearSelector && (
              <div className="absolute mt-12 bg-white shadow-lg rounded-lg p-2 z-10">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={yearInput}
                    onChange={handleYearInputChange}
                    onKeyDown={handleYearInputKeyDown}
                    placeholder="Type a year"
                    className="p-1 border rounded font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]"
                  />
                  <button
                    onClick={() => setShowYearSelector(false)}
                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>
                {Array.from(
                  { length: 10 },
                  (_, i) => currentDate.getFullYear() - 5 + i
                ).map((year) => (
                  <div
                    key={year}
                    className="cursor-pointer hover:bg-[#0B6EC9] hover:text-white p-1 rounded font-bold text-lg"
                    onClick={() => changeYear(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={nextMonth}
            className="text-[#0B6EC9] hover:text-[#094a86] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B6EC9] rounded-full p-2"
          >
            <FaChevronRight className="xl:h-4 xl:w-4 2xl:h-6 2xl:w-6" />
          </button>
        </div>
        <div className="grid grid-cols-7 xl:gap-0 2xl:gap-2">
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
        {selectedDate && (
          <div className="mt-4 text-center text-lg font-semibold text-[#062341]">
            Selected Date: {selectedDate.toLocaleDateString()}
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
