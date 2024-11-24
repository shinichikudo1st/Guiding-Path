import { BsGearFill, BsBellFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OpenSettings from "./openSettings";
import OpenLogout from "./openLogout";
import Notifications from "./notifications";

const UserNavbar = ({ profile }) => {
  const [isLogoutToggled, setIsLogoutToggled] = useState(false);
  const [isSettingsToggled, setIsSettingsToggled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 2000);
    fetchUnreadCount();
    fetchUserInfo();
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notificationCount");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/navbarInfo");
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      } else {
        console.error("Failed to fetch user info:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const logout = async () => {
    sessionStorage.clear();
    await fetch("/api/logoutUser", {
      method: "POST",
    });
    setIsLogoutToggled(false);
    setIsSettingsToggled(false);
    router.push("/");
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSettingsToggled(false);
    setIsLogoutToggled(false);
  };

  const toggleSettings = () => {
    setIsSettingsToggled(!isSettingsToggled);
    setIsNotificationsOpen(false);
    setIsLogoutToggled(false);
  };

  const toggleLogout = () => {
    setIsLogoutToggled(!isLogoutToggled);
    setIsSettingsToggled(false);
    setIsNotificationsOpen(false);
  };

  const navItemStyles = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const handleNotificationChange = () => {
    fetchUnreadCount();
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-lg z-50"
    >
      <motion.h1
        variants={navItemStyles}
        initial="initial"
        animate="animate"
        className="text-[#062341] font-bold text-xl sm:text-2xl lg:text-3xl flex items-center gap-3"
      >
        Guiding Path
        {userInfo && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={profile}
            className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-white/90 to-[#F8FAFC]/90 px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm text-sm ml-3 cursor-pointer border border-[#0B6EC9]/10 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col">
              <h2 className="text-[#062341] font-semibold">{userInfo.name}</h2>
              <span className="text-sm text-[#0B6EC9] capitalize">
                {userInfo.role}
              </span>
            </div>
          </motion.div>
        )}
      </motion.h1>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <motion.div
            variants={navItemStyles}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <BsBellFill
              className={`text-xl sm:text-2xl cursor-pointer transition-colors duration-300 ${
                isNotificationsOpen
                  ? "text-[#0B6EC9]"
                  : "text-[#062341] hover:text-[#0B6EC9]"
              }`}
              onClick={toggleNotifications}
            />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.div>
          <Notifications
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNotificationChange={handleNotificationChange}
            unreadCount={unreadCount}
          />
        </div>

        <motion.div
          variants={navItemStyles}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <BsGearFill
            className={`text-xl sm:text-2xl cursor-pointer transition-colors duration-300 ${
              isSettingsToggled
                ? "text-[#0B6EC9]"
                : "text-[#062341] hover:text-[#0B6EC9]"
            }`}
            onClick={toggleSettings}
          />
        </motion.div>

        <motion.button
          variants={navItemStyles}
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleLogout}
          className={`hidden sm:block px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
            isLogoutToggled
              ? "bg-[#0B6EC9] text-white"
              : "bg-white text-[#062341] hover:bg-[#F8FAFC] border border-[#0B6EC9]/20"
          }`}
        >
          Logout
        </motion.button>

        {isSettingsToggled && <OpenSettings />}
        {isLogoutToggled && (
          <OpenLogout setisLogoutToggled={setIsLogoutToggled} logout={logout} />
        )}
      </div>
    </motion.nav>
  );
};

export default UserNavbar;
