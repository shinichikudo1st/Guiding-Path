import {
  FaEdit,
  FaFile,
  FaUserCircle,
  FaUserClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const TeacherSidebar = ({
  profile,
  appointment,
  referral,
  resource,
  activeComponent,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarItems = [
    {
      name: "profile",
      icon: FaUserCircle,
      label: "My Profile",
      onClick: profile,
    },
    {
      name: "appointment",
      icon: FaUserClock,
      label: "Appointments",
      onClick: appointment,
    },
    {
      name: "referral",
      icon: FaEdit,
      label: "Referrals",
      onClick: referral,
    },
    {
      name: "resources",
      icon: FaFile,
      label: "Resources",
      onClick: resource,
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

  const ToggleButton = () => (
    <button
      onClick={toggleSidebar}
      className="fixed left-4 bottom-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-lg md:hidden"
    >
      {isSidebarOpen ? <FaTimes /> : <FaBars />}
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg z-40
              ${isSidebarOpen ? "block" : "hidden md:block"}`}
          >
            <div className="flex flex-col gap-2">
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    item.onClick();
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={getItemClassName(item.name)}
                >
                  <item.icon className="text-2xl flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <ToggleButton />
    </>
  );
};

export default TeacherSidebar;
