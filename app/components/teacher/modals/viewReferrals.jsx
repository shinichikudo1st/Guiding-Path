import { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";

const ViewReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");

  const fetchReferrals = async () => {
    try {
      const response = await fetch("/api/getReferrals");
      if (!response.ok) {
        throw new Error("Failed to fetch referrals");
      }
      const data = await response.json();
      setReferrals(data);
      setFilteredReferrals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleCancelReferral = async (referralId) => {
    try {
      const response = await fetch(`/api/cancelReferral?id=${referralId}`, {
        method: "PUT",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          content: "Referral cancelled successfully!",
        });
        setTimeout(() => {
          setMessage("");
        }, 1000);
      }
    } catch (error) {
      setError("Error cancelling referral: " + error.message);
    } finally {
      fetchReferrals();
    }
  };

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredReferrals(referrals);
    } else {
      setFilteredReferrals(
        referrals.filter((referral) => referral.status === statusFilter)
      );
    }
  }, [statusFilter, referrals]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "confirmed":
      case "in_progress":
        return "bg-blue-200 text-blue-800";
      case "closed":
      case "completed":
        return "bg-gray-200 text-gray-700";
      case "rejected":
        return "bg-red-200 text-red-800";
      case "cancelled":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed/In Progress" },
    { value: "closed", label: "Closed/Completed" },
  ];

  return (
    <div className="w-full h-[85%] bg-[#E6F0F9] p-6 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#E6F0F9]">
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="font-medium">{message.content}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#062341] mb-4 md:mb-0">
          View Referrals
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                statusFilter === option.value
                  ? "bg-[#0B6EC9] text-white"
                  : "bg-white text-[#0B6EC9] hover:bg-[#0B6EC9] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {filteredReferrals.length === 0 ? (
        <p className="text-center text-gray-500">No referrals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReferrals.map((referral) => (
            <div
              key={referral.referral_id}
              className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col h-full"
            >
              <div className="flex-grow">
                <div className="flex items-center mb-4">
                  <FaUser className="mr-3 text-[#0B6EC9] text-xl" />
                  <span className="font-semibold text-lg">
                    {referral.student?.student?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <FaChalkboardTeacher className="mr-3 text-[#0B6EC9] text-lg" />
                  <span className="text-gray-700">
                    {referral.teacher?.teacher?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <FaClipboardList className="mr-3 text-[#0B6EC9] text-lg" />
                  <span className="text-gray-700">
                    {referral.reason || "N/A"}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <FaCalendarAlt className="mr-3 text-[#0B6EC9] text-lg" />
                  <span className="text-gray-700">
                    {referral.dateSubmitted
                      ? new Date(referral.dateSubmitted).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-3 bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-600 italic">
                    "{referral.notes || "No additional notes"}"
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200">
                {referral.status === "pending" && (
                  <button
                    onClick={() => handleCancelReferral(referral.referral_id)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    referral.status
                  )}`}
                >
                  {referral.status
                    ? referral.status.charAt(0).toUpperCase() +
                      referral.status.slice(1).replace("_", " ")
                    : "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReferrals;
