import { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import ViewReferralCounselor from "../modals/viewReferralCounselor";
import { motion } from "framer-motion";

const ReferralLoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-4 shadow-md animate-pulse"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0B6EC9]/20 rounded-full mr-2" />
            <div>
              <div className="h-3 w-16 bg-[#0B6EC9]/20 rounded mb-1" />
              <div className="h-4 w-24 bg-[#0B6EC9]/20 rounded" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0B6EC9]/20 rounded-full mr-2" />
            <div>
              <div className="h-3 w-16 bg-[#0B6EC9]/20 rounded mb-1" />
              <div className="h-4 w-24 bg-[#0B6EC9]/20 rounded" />
            </div>
          </div>
          <div className="flex items-center lg:col-span-2">
            <div className="w-8 h-8 bg-[#0B6EC9]/20 rounded-full mr-2" />
            <div className="flex-1">
              <div className="h-3 w-16 bg-[#0B6EC9]/20 rounded mb-1" />
              <div className="h-4 w-full bg-[#0B6EC9]/20 rounded" />
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-end items-center">
          <div className="w-4 h-4 bg-[#0B6EC9]/20 rounded-full mr-1" />
          <div className="h-3 w-32 bg-[#0B6EC9]/20 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const ReferralCounselor = () => {
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedReferralId, setSelectedReferralId] = useState(null);

  const [activeTab, setActiveTab] = useState("pending");

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/getStatusReferrals?status=${filterStatus}`
      );
      if (response.ok) {
        const data = await response.json();
        setReferrals(data.referrals);
        console.log(data.referrals);
      } else {
        throw new Error(`Failed to fetch ${filterStatus} referrals`);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      setError(error.message || `Error fetching ${filterStatus} referrals`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [filterStatus]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleReferralClick = (referralId) => {
    setSelectedReferralId(referralId);
  };

  const handleCloseModal = () => {
    setSelectedReferralId(null);
  };

  const handleTabChange = (status) => {
    setFilterStatus(status);
    setActiveTab(status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Referrals
            </h1>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex w-full justify-evenly select-none bg-white rounded-full shadow-md">
              <span
                onClick={() => handleTabChange("pending")}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  activeTab === "pending"
                    ? "bg-[#0B6EC9] text-white"
                    : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-l-full font-bold`}
              >
                Pending
              </span>
              <span
                onClick={() => handleTabChange("confirmed")}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  activeTab === "confirmed"
                    ? "bg-[#0B6EC9] text-white"
                    : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold`}
              >
                Confirmed
              </span>
              <span
                onClick={() => handleTabChange("closed")}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  activeTab === "closed"
                    ? "bg-[#0B6EC9] text-white"
                    : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-r-full font-bold`}
              >
                Closed
              </span>
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh] max-h-[60vh] overflow-y-auto px-2 sm:px-4 scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <ReferralLoadingSkeleton />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base sm:text-lg md:text-xl text-red-500 font-semibold">
                    {error}
                  </p>
                </div>
              ) : referrals.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center">
                    No {filterStatus} referrals at the moment.
                  </p>
                </div>
              ) : (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-white rounded-lg p-3 sm:p-4 mb-3 shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => handleReferralClick(referral.id)}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                      {/* Student Info */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <FaUser className="text-[#0B6EC9]" size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          {" "}
                          {/* min-w-0 ensures proper truncation */}
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            Student
                          </p>
                          <p className="font-semibold text-xs sm:text-sm md:text-base truncate">
                            {referral.student_name}
                          </p>
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          <FaChalkboardTeacher
                            className="text-[#0B6EC9]"
                            size={16}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            Teacher
                          </p>
                          <p className="text-xs sm:text-sm md:text-base truncate">
                            {referral.teacher_name}
                          </p>
                        </div>
                      </div>

                      {/* Reason Info */}
                      <div className="flex items-center space-x-2 lg:col-span-2">
                        <div className="flex-shrink-0">
                          <IoMdInformationCircle
                            className="text-[#0B6EC9]"
                            size={16}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            Reason
                          </p>
                          <p className="text-[10px] sm:text-xs md:text-sm truncate">
                            {referral.reason}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date Info */}
                    <div className="mt-2 flex justify-end items-center space-x-1">
                      <FaCalendarAlt
                        className="text-[#0B6EC9] flex-shrink-0"
                        size={14}
                      />
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                        {formatDate(referral.dateSubmitted)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedReferralId && (
        <ViewReferralCounselor
          referralId={selectedReferralId}
          onClose={handleCloseModal}
          onRefresh={fetchReferrals}
        />
      )}
    </motion.div>
  );
};

export default ReferralCounselor;
