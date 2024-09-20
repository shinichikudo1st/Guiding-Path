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

  useEffect(() => {
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

    fetchReferrals();
  }, []);

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
              <div className="mt-4 flex justify-end items-center pt-4 border-t border-gray-200">
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
