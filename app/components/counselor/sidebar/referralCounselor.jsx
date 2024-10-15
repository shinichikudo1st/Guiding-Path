import { useState, useEffect } from "react";
import {
  FaUser,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import { IoMdInformationCircle } from "react-icons/io";
import LoadingSpinner from "../../UI/loadingSpinner";
import ViewReferralCounselor from "../modals/viewReferralCounselor";

const ReferralCounselor = () => {
  const [referrals, setReferrals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedReferralId, setSelectedReferralId] = useState(null);

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex flex-col items-center p-8 overflow-hidden shadow-lg">
        <h2 className="text-3xl font-bold text-[#062341]">
          {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}{" "}
          Referrals
        </h2>
        <div className="w-full flex justify-between items-center mb-8">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaFilter className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100%-5rem)] overflow-y-auto pr-4">
          {referrals.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600 text-center">
                No {filterStatus} referrals at the moment.
              </p>
            </div>
          ) : (
            referrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-white rounded-lg p-6 mb-6 shadow-md cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleReferralClick(referral.id)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <FaUser
                      className="text-[#0B6EC9] mr-3 flex-shrink-0"
                      size={24}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Student</p>
                      <p className="font-semibold truncate">
                        {referral.student_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaChalkboardTeacher
                      className="text-[#0B6EC9] mr-3 flex-shrink-0"
                      size={24}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Teacher</p>
                      <p className="truncate">{referral.teacher_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center lg:col-span-2">
                    <IoMdInformationCircle
                      className="text-[#0B6EC9] mr-3 flex-shrink-0"
                      size={24}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Reason</p>
                      <p className="text-sm truncate">{referral.reason}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end items-center">
                  <FaCalendarAlt
                    className="text-[#0B6EC9] mr-2 flex-shrink-0"
                    size={18}
                  />
                  <p className="text-sm text-gray-600">
                    {formatDate(referral.dateSubmitted)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedReferralId && (
        <ViewReferralCounselor
          referralId={selectedReferralId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ReferralCounselor;
