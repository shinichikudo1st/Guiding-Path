import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      setFilteredReferrals(
        [...referrals].sort(
          (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
        )
      );
    } else {
      setFilteredReferrals(
        referrals
          .filter((referral) => referral.status === statusFilter)
          .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
      );
    }
  }, [statusFilter, referrals]);

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
    { value: "confirmed", label: "Confirmed" },
    { value: "closed", label: "Closed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-6 py-3 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-xl font-semibold"
        >
          <FaSpinner className="animate-spin h-5 w-5" />
          Loading Referrals...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Filter Navigation */}
      <div className="flex flex-wrap justify-center gap-2 bg-[#E6F0F9] p-2 rounded-xl">
        {filterOptions.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStatusFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              statusFilter === option.value
                ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-md"
                : "text-[#062341] hover:bg-white/50"
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Referrals Grid */}
      {filteredReferrals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[300px] text-center"
        >
          <FaClipboardList className="text-4xl text-[#0B6EC9]/30 mb-4" />
          <h3 className="text-xl font-semibold text-[#062341]">
            No Referrals Found
          </h3>
          <p className="text-[#062341]/70 mt-2">
            No referrals match the selected filter
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredReferrals.map((referral, index) => (
            <motion.div
              key={referral.referral_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden h-full"
            >
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="space-y-3 flex-grow">
                  {/* Student Info */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaUser className="text-[#0B6EC9] text-base sm:text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#062341]/60">Student</p>
                      <p className="font-semibold text-sm sm:text-base text-[#062341] line-clamp-1">
                        {referral.student?.student?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="flex items-center gap-3">
                    <FaChalkboardTeacher className="text-[#0B6EC9] text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#062341]/60">Teacher</p>
                      <p className="text-[#062341]">
                        {referral.teacher?.teacher?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="flex items-center gap-3">
                    <FaClipboardList className="text-[#0B6EC9] text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#062341]/60">Reason</p>
                      <p className="text-[#062341]">
                        {referral.reason || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-[#0B6EC9] text-lg flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#062341]/60">
                        Date Submitted
                      </p>
                      <p className="text-[#062341]">
                        {referral.dateSubmitted
                          ? new Date(
                              referral.dateSubmitted
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Notes - with max height and scroll */}
                  <div className="bg-white/50 rounded-lg p-2 sm:p-3 mt-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent">
                    <p className="text-xs sm:text-sm text-[#062341]/70 italic line-clamp-3">
                      "{referral.notes || "No additional notes"}"
                    </p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="mt-4 pt-3 border-t border-[#0B6EC9]/10 flex justify-between items-center">
                  {referral.status === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancelReferral(referral.referral_id)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  )}
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
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
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ViewReferrals;
