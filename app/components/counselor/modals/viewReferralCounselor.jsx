import { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaVideo,
  FaUserFriends,
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
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-xl flex flex-col max-h-[90vh] ${
          referral?.status === "pending" ? "lg:flex-row" : ""
        }`}
      >
        {/* Left side - Referral Details */}
        <div
          className={`${
            referral?.status === "pending" ? "w-full lg:w-1/2" : "w-full"
          } overflow-y-auto max-h-[90vh] lg:max-h-[85vh]`}
        >
          <div className="sticky top-0 z-10 bg-white border-b border-[#0B6EC9]/10">
            <h2 className="text-2xl font-bold p-6 text-[#062341]">
              Referral Details
            </h2>
          </div>
          <div className="p-6 pt-4">
            {isLoading ? (
              <SkeletonLoading />
            ) : error ? (
              <div className="text-center">
                <p className="text-xl text-red-500 font-semibold">{error}</p>
              </div>
            ) : referral ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <FaUser className="text-[#0B6EC9] text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-semibold text-lg">
                      {referral.student_name}
                    </p>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <FaChalkboardTeacher className="text-[#0B6EC9] text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="font-semibold text-lg">
                      {referral.teacher_name}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <IoMdInformationCircle
                    className={`text-2xl mr-4 ${getStatusColor(
                      referral.status
                    )}`}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`font-semibold text-lg ${getStatusColor(
                        referral.status
                      )}`}
                    >
                      {referral.status.charAt(0).toUpperCase() +
                        referral.status.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Reason & Notes */}
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Reason:</p>
                    <p className="bg-gray-50 p-4 rounded-lg">
                      {referral.reason}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Notes:</p>
                    <p className="bg-gray-50 p-4 rounded-lg">
                      {referral.notes}
                    </p>
                  </div>
                </div>

                {/* Appointment Details for Confirmed/Closed Status */}
                {(referral.status === "confirmed" ||
                  referral.status === "closed") && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
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
                        <p className="text-sm text-gray-500">Counselor</p>
                        <p className="font-semibold text-lg">
                          {referral.counselor_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <FaCalendarAlt className="text-[#0B6EC9] mr-4 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Appointment Schedule
                        </p>
                        <p className="font-semibold">
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
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right side - Only show for pending status */}
        {referral && referral.status === "pending" && (
          <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-[#0B6EC9]/10 flex flex-col max-h-[90vh] lg:max-h-[85vh]">
            <div className="sticky top-0 z-10 bg-white border-b border-[#0B6EC9]/10">
              <h3 className="text-xl font-semibold p-6">
                Schedule Appointment
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <AvailableAppointmentSlot
                onSelectSlot={handleSelectSlot}
                initialDate={new Date()}
              />
              {message.content && (
                <div className="mt-4">
                  <div
                    className={`p-2 rounded ${
                      message.type === "error"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#0B6EC9]/10 p-4">
              <div className="flex space-x-4">
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
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg hover:from-[#095396] hover:to-[#084B87] transition-all duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewReferralCounselor;
