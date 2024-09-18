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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await fetch("/api/getReferrals");
        if (!response.ok) {
          throw new Error("Failed to fetch referrals");
        }
        const data = await response.json();
        setReferrals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, []);

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

  return (
    <div className="w-full h-[85%] bg-[#E6F0F9] p-6 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#E6F0F9]">
      <h2 className="text-3xl font-bold text-[#062341] mb-6">View Referrals</h2>
      {referrals.length === 0 ? (
        <p className="text-center text-gray-500">No referrals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {referrals.map((referral) => (
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
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    referral.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : referral.status === "in_progress"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {referral.status
                    ? referral.status.charAt(0).toUpperCase() +
                      referral.status.slice(1).replace("_", " ")
                    : "N/A"}
                </span>
                <button className="text-[#0B6EC9] hover:underline focus:outline-none">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewReferrals;
