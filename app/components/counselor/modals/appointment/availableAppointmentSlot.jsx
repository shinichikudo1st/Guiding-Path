import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AvailableAppointmentSlot = ({ onSelectSlot, initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots();
    }
  }, [selectedDate, appointments]);

  const fetchAppointments = async () => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const monthString = `${year}-${month}`;

    try {
      const response = await fetch(
        `/api/getAllAppointments?month=${monthString}`
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

  const generateAvailableSlots = () => {
    const workingHours = [
      "08:00 AM",
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
      "06:00 PM",
      "08:00 PM",
    ];

    const takenSlots = appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.date_time);
        return appointmentDate.toDateString() === selectedDate.toDateString();
      })
      .map((appointment) => {
        const appointmentDate = new Date(appointment.date_time);
        return appointmentDate
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase();
      });

    const slotsWithStatus = workingHours.map((slot) => ({
      time: slot,
      status: takenSlots.includes(slot) ? "occupied" : "available",
    }));

    setAvailableSlots(slotsWithStatus);
  };

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

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    if (
      newDate >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ) {
      setCurrentDate(newDate);
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      currentDate.getFullYear() === now.getFullYear() &&
      currentDate.getMonth() === now.getMonth()
    );
  };

  const selectDate = (day) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (
      selected >= new Date() &&
      selected.getDay() !== 0 &&
      selected.getDay() !== 6
    ) {
      setSelectedDate(selected);
      setSelectedSlot(null);
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

  const selectSlot = (slot) => {
    if (slot.status === "available") {
      setSelectedSlot(slot.time);
      const dateTime = new Date(selectedDate);
      const [time, period] = slot.time.split(" ");
      const [hours, minutes] = time.split(":");
      let hour = parseInt(hours, 10);
      if (period === "PM" && hour !== 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }
      dateTime.setHours(hour, parseInt(minutes, 10));
      onSelectSlot(dateTime);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className={`text-blue-600 hover:text-blue-800 transition-colors ${
            isCurrentMonth() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isCurrentMonth()}
        >
          <FaChevronLeft className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={nextMonth}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaChevronRight className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-sm text-gray-600"
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
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const hasAppointmentOnDay = hasAppointment(date);
          const isPastDate = date < new Date();
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isDisabled = isPastDate || isWeekend;

          return (
            <div
              key={day}
              className={`h-10 flex items-center justify-center text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out rounded-full
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${hasAppointmentOnDay ? "bg-yellow-200" : "hover:bg-gray-200"}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !isDisabled && selectDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Available slots for {selectedDate.toLocaleDateString()}:
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => selectSlot(slot)}
                disabled={slot.status === "occupied"}
                className={`py-2 px-4 rounded transition-colors ${
                  slot.status === "available"
                    ? "bg-green-100 hover:bg-green-200 text-green-800"
                    : "bg-red-100 text-red-800 cursor-not-allowed"
                } ${selectedSlot === slot.time ? "ring-2 ring-blue-500" : ""}`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableAppointmentSlot;
