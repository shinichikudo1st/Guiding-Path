import { useEffect, useState } from "react";
import { FaUserFriends, FaCalendarCheck, FaCalendarDay } from "react-icons/fa";
import { motion } from "framer-motion";

const QuickViewCounselor = ({ referral, appointment, todayAppointment }) => {
  const [counts, setCounts] = useState({
    referralCount: 0,
    appointmentCount: 0,
    todayAppointmentCount: 0,
  });

  useEffect(() => {
    let eventSource;

    const connectSSE = () => {
      eventSource = new EventSource("/api/quickview/stream");

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCounts({
          referralCount: data.referralCount,
          appointmentCount: data.appointmentCount,
          todayAppointmentCount: data.todayAppointmentCount,
        });
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cards = [
    {
      icon: FaCalendarDay,
      title: "Dashboard",
      count: counts.todayAppointmentCount,
      description: "Today's scheduled appointments",
      onClick: todayAppointment,
    },
    {
      icon: FaUserFriends,
      title: "Referral Requests",
      count: counts.referralCount,
      description: "Pending referrals from teachers",
      onClick: referral,
    },
    {
      icon: FaCalendarCheck,
      title: "Appointment Requests",
      count: counts.appointmentCount,
      description: "Pending appointment requests",
      onClick: appointment,
    },
  ];

  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg md:translate-x-0 transition-transform duration-300 translate-x-full sm:translate-x-0"
    >
      <div className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            onClick={card.onClick}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center transform hover:scale-102 hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#0B6EC9]/5"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-3 shadow-md">
              <card.icon className="text-2xl text-white" />
            </div>

            <h2 className="text-lg font-semibold text-[#062341] text-center mb-2">
              {card.title}
            </h2>

            <p className="text-3xl font-bold bg-gradient-to-r from-[#0B6EC9] to-[#095396] bg-clip-text text-transparent">
              {card.count}
            </p>

            <p className="text-sm text-gray-500 mt-2 text-center">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default QuickViewCounselor;
