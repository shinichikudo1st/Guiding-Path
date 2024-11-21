import { FaBell, FaBookOpen, FaUserCircle, FaUserClock } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { motion } from "framer-motion";

const StudentSidebar = ({
  viewProfile,
  viewAppraisal,
  viewAppointment,
  viewAnnouncement,
  activeComponent,
  viewResources,
}) => {
  const sidebarItems = [
    {
      name: "profile",
      icon: FaUserCircle,
      label: "My Profile",
      onClick: viewProfile,
    },
    {
      name: "appointment",
      icon: FaUserClock,
      label: "Appointments",
      onClick: viewAppointment,
    },
    {
      name: "announcement",
      icon: FaBell,
      label: "Announcements",
      onClick: viewAnnouncement,
    },
    {
      name: "resources",
      icon: FaBookOpen,
      label: "Resources",
      onClick: viewResources,
    },
    {
      name: "appraisal",
      icon: BsChatFill,
      label: "Appraisal",
      onClick: viewAppraisal,
    },
  ];

  const getItemClassName = (itemName) => {
    const baseClass =
      "flex items-center font-semibold gap-3 w-full px-4 py-3 cursor-pointer rounded-xl transition-all duration-300";
    return `${baseClass} ${
      activeComponent === itemName
        ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-md"
        : "hover:bg-[#D1E5F7] text-[#062341] hover:text-[#0B6EC9]"
    }`;
  };

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg md:translate-x-0 transition-transform duration-300 -translate-x-full sm:translate-x-0"
    >
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={item.onClick}
            className={getItemClassName(item.name)}
          >
            <item.icon className="text-2xl flex-shrink-0" />
            <span className="text-sm whitespace-nowrap">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
};

export default StudentSidebar;
