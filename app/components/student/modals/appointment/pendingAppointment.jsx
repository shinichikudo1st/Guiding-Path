import Image from "next/image";
import { useEffect, useState } from "react";
import { encrypt, decrypt } from "@/app/utils/security";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserMd,
  FaPhoneAlt,
  FaClipboardList,
} from "react-icons/fa";

const PendingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const retrievePendingAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pendingAppointments");
      const result = await response.json();

      console.log(result.message);
      setAppointments(result.appointment);

      const encryptedAppointments = encrypt(result.appointment);
      if (encryptedAppointments) {
        sessionStorage.setItem("pendingAppointments", encryptedAppointments);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    const sessionCache = sessionStorage.getItem("pendingAppointments");
    if (sessionCache) {
      const decryptedAppointments = decrypt(sessionCache);
      if (decryptedAppointments) {
        setAppointments(decryptedAppointments);
        setLoading(false);
      } else {
        retrievePendingAppointments();
      }
    } else {
      retrievePendingAppointments();
    }
  }, []);

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await fetch(`/api/cancelAppointment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedAppointmentId }),
      });

      if (response.ok) {
        // Refresh appointments after successful cancellation
        retrievePendingAppointments();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedAppointmentId(null);
    }
  };

  return (
    <div className="absolute w-[90%] h-[80%] bg-gradient-to-br from-[#F0F8FF] to-[#E6F0F9] mt-[6%] rounded-lg shadow-lg overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#D8E8F6]">
      {loading ? (
        <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#F0F8FF] dark:bg-gray-800">
          <div className="px-4 py-2 text-[16pt] font-semibold leading-none text-center text-blue-800 bg-blue-100 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            Loading Appointments...
          </div>
        </div>
      ) : appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            className="flex h-[45%] w-[100%] mt-[2%] bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            key={appointment.appointment_id}
          >
            <div className="flex w-[70%] h-[100%] bg-gradient-to-r from-[#F0F8FF] to-[#E6F0F9]">
              <div className="w-[35%] h-[100%] flex justify-center items-center p-[5%]">
                <Image
                  alt="profilePicture"
                  src={appointment.counselor.counselor.profilePicture}
                  width={130}
                  height={130}
                  className="w-[50px] h-[50px] xl:w-[120px] xl:h-[120px] 2xl:w-[130px] 2xl:h-[130px] rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-center pl-[5%] gap-[8%] w-[65%] h-[100%] text-[#062341]">
                <div className="flex items-center xl:text-[9pt] 2xl:text-[12pt]">
                  <FaUserMd className="text-[#0B6EC9] mr-2" />
                  <label className="font-bold">Counselor:</label>
                  <span className="ml-[2%] font-medium">
                    {appointment.counselor.counselor.name}
                  </span>
                </div>
                <div className="flex items-center xl:text-[9pt] 2xl:text-[12pt]">
                  <FaPhoneAlt className="text-[#0B6EC9] mr-2" />
                  <label className="font-bold">Contact Info:</label>
                  <span className="ml-[2%]">
                    {appointment.counselor.counselor.contact}
                  </span>
                </div>
                <div className="flex items-center xl:text-[9pt] 2xl:text-[12pt]">
                  <FaCalendarAlt className="text-[#0B6EC9] mr-2" />
                  <label className="font-bold">Date & Time:</label>
                  <span className="ml-[2%]">{appointment.date_time}</span>
                </div>
                <div className="flex items-center xl:text-[9pt] 2xl:text-[12pt]">
                  <FaMapMarkerAlt className="text-[#0B6EC9] mr-2" />
                  <label className="font-bold">Location:</label>
                  <span className="ml-[2%]">CTU-Admin Room 301A</span>
                </div>
                <div className="flex items-center xl:text-[9pt] 2xl:text-[12pt]">
                  <FaClipboardList className="text-[#0B6EC9] mr-2" />
                  <label className="font-bold">Type:</label>
                  <span className="ml-[2%]">{appointment.type}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between w-[30%] p-[3%] bg-gradient-to-br from-[#0B6EC9] to-[#1E90FF] text-white">
              <div className="text-center font-medium mt-4">
                <span>Please wait for the schedule</span>
              </div>
              <button
                onClick={() => handleCancelClick(appointment.appointment_id)}
                className="w-[80%] mb-4 bg-white text-red-600 font-bold py-2 px-4 rounded-full transition-all duration-300 hover:bg-red-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-[18pt] font-semibold text-gray-400">
            There are no pending appointments.
          </p>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Appointment
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                No, Keep it
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingAppointment;
