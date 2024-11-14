import { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaVideo,
  FaUserFriends,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import Image from "next/image";
import AvailableAppointmentSlot from "./appointment/availableAppointmentSlot";

const ViewReferralCounselor = ({ referralId, onClose, onRefresh }) => {
  const [referral, setReferral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [counselType, setCounselType] = useState("inperson");
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  useEffect(() => {
    const fetchReferral = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/getReferral?id=${referralId}`);
        if (response.ok) {
          const data = await response.json();
          setReferral(data.referral);
        } else {
          throw new Error("Failed to fetch referral");
        }
      } catch (error) {
        console.error("Error fetching referral:", error);
        setError(error.message || "Error fetching referral");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferral();
  }, [referralId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRejectReferral = async () => {
    try {
      const response = await fetch(`/api/rejectReferral?id=${referralId}`, {
        method: "PUT",
      });
      if (response.ok) {
        setMessage({
          type: "success",
          content: "Referral rejected successfully!",
        });
        setTimeout(() => {
          onClose();
          onRefresh();
        }, 2000);
      } else {
        throw new Error("Failed to reject referral");
      }
    } catch (error) {
      setError("Error rejecting referral: " + error.message);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedDateTime) {
      setMessage({
        type: "error",
        content: "Please select an appointment slot.",
      });
      return;
    }

    setIsCreatingAppointment(true);

    try {
      const response = await fetch("/api/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_id: referral.id,
          date: selectedDateTime.toISOString(),
          id: referral.student_id,
          role: "teacher", // Since this is a referral
          notes: referral.notes,
          reason: referral.reason,
          counsel_type: counselType,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Appointment created successfully!",
        });
        setTimeout(() => {
          onClose();
          onRefresh();
        }, 2000);
      } else {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setMessage({
        type: "error",
        content: "Failed to create appointment. Please try again.",
      });
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const SkeletonLoading = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "confirmed":
        return "text-blue-500";
      case "closed":
        return "text-gray-500";
      default:
        return "text-black";
    }
  };

  const handleSelectSlot = (dateTime) => {
    setSelectedDateTime(dateTime);
    setSelectedDate(dateTime.toISOString().split("T")[0]);
    setSelectedTime(
      dateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
      <div className="absolute inset-0 bg-black opacity-[0.8] h-screen w-screen z-30"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-[90vw] z-50 max-h-[90vh] overflow-hidden flex">
        {/* Left side - Referral Details */}
        <div className="w-1/2 pr-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#D8E8F6]">
          <h2 className="text-2xl font-bold mb-4">Referral Details</h2>
          {isLoading ? (
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-600">
                Loading referral...
              </p>
              <SkeletonLoading />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-xl text-red-500 font-semibold">{error}</p>
            </div>
          ) : referral ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                <span className="font-semibold">Student:</span>
                <span className="ml-2">{referral.student_name}</span>
              </div>
              <div className="flex items-center">
                <FaChalkboardTeacher className="mr-2 text-green-500" />
                <span className="font-semibold">Teacher:</span>
                <span className="ml-2">{referral.teacher_name}</span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-red-500" />
                <span className="font-semibold">Date Submitted:</span>
                <span className="ml-2">
                  {formatDate(referral.dateSubmitted)}
                </span>
              </div>
              <div className="flex items-center">
                <IoMdInformationCircle
                  className={`mr-2 ${getStatusColor(referral.status)}`}
                />
                <span className="font-semibold">Status:</span>
                <span className={`ml-2 ${getStatusColor(referral.status)}`}>
                  {referral.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Reason:</span>
                <p className="mt-2 p-4 bg-gray-100 rounded">
                  {referral.reason}
                </p>
              </div>
              <div>
                <span className="font-semibold">Notes:</span>
                <p className="mt-2 p-4 bg-gray-100 rounded">{referral.notes}</p>
              </div>

              {(referral.status === "closed" ||
                referral.status === "confirmed") && (
                <>
                  <div className="flex items-center mt-4">
                    <Image
                      src={
                        referral.counselor_profilePicture ||
                        "/default-avatar.png"
                      }
                      alt="Counselor"
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">Counselor:</p>
                      <p>{referral.counselor_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-purple-500" />
                    <span className="font-semibold">Appointment:</span>
                    <span className="ml-2">
                      {referral.appointment_date_time
                        ? `${formatDate(
                            referral.appointment_date_time
                          )} at ${new Date(
                            referral.appointment_date_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Not scheduled"}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* Right side - Appointment Scheduling */}
        {referral && referral.status === "pending" && (
          <div className="w-1/2 pl-6 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#D8E8F6]">
            <h3 className="text-xl font-semibold mb-4">Schedule Appointment</h3>
            <AvailableAppointmentSlot
              onSelectSlot={handleSelectSlot}
              initialDate={new Date()}
            />
            <div className="mt-4">
              <span className="font-semibold block mb-2">Counsel Type:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCounselType("inperson")}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded ${
                    counselType === "inperson"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <FaUserFriends className="mr-2" />
                  In-person
                </button>
                <button
                  onClick={() => setCounselType("virtual")}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded ${
                    counselType === "virtual"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <FaVideo className="mr-2" />
                  Virtual
                </button>
              </div>
            </div>
            {message.content && (
              <div
                className={`mt-4 p-2 rounded ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.content}
              </div>
            )}
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleCreateAppointment}
                disabled={isCreatingAppointment}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isCreatingAppointment ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Appointment"
                )}
              </button>
              <button
                onClick={handleRejectReferral}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject Referral
              </button>
            </div>
          </div>
        )}

        {/* Single Close button - Absolute positioned */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewReferralCounselor;
