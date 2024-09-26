import { useEffect, useState } from "react";
import { FaUserFriends, FaCalendarCheck } from "react-icons/fa";

const QuickViewCounselor = () => {
  const [referralCount, setReferralCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    // Fetch referral requests count
    const fetchReferralCount = async () => {
      try {
        const response = await fetch("/api/countPendingReferrals");
        const data = await response.json();
        setReferralCount(data.pendingReferrals);
      } catch (error) {
        console.error("Error fetching referral count:", error);
      }
    };

    // Fetch appointment requests count
    const fetchAppointmentCount = async () => {
      try {
        const response = await fetch("/api/countPendingRequests");
        const data = await response.json();
        setAppointmentCount(data.pendingRequests);
      } catch (error) {
        console.error("Error fetching appointment count:", error);
      }
    };

    fetchReferralCount();
    fetchAppointmentCount();
  }, []);

  return (
    <aside className="fixed right-0 top-[75px] w-[20%] h-[calc(100vh-75px)] bg-gradient-to-b from-[#E6F0F9] to-[#B3D4F2] shadow-lg p-6 overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="h-[30%] bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col justify-center items-center transform hover:scale-105 transition-transform duration-300">
        <FaUserFriends className="text-4xl text-[#0B6EC9] mb-2" />
        <h2 className="text-2xl font-semibold text-[#062341] mb-2">
          Referral Requests
        </h2>
        <p className="text-4xl font-bold text-[#0B6EC9]">{referralCount}</p>
        <p className="text-sm text-gray-500 mt-2">
          Pending referrals from teachers
        </p>
      </div>
      <div className="h-[30%] bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center transform hover:scale-105 transition-transform duration-300">
        <FaCalendarCheck className="text-4xl text-[#0B6EC9] mb-2" />
        <h2 className="text-2xl font-semibold text-[#062341] mb-2">
          Appointment Requests
        </h2>
        <p className="text-4xl font-bold text-[#0B6EC9]">{appointmentCount}</p>
        <p className="text-sm text-gray-500 mt-2">
          Pending appointment requests
        </p>
      </div>
    </aside>
  );
};

export default QuickViewCounselor;
