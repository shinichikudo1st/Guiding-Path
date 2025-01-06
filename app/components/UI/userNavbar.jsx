import { BsGearFill, BsBellFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OpenSettings from "./openSettings";
import OpenLogout from "./openLogout";
import Notifications from "./notifications";
import Image from "next/image";

const UserNavbar = ({ profile, onPageChange }) => {
  const [isLogoutToggled, setIsLogoutToggled] = useState(false);
  const [isSettingsToggled, setIsSettingsToggled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let eventSource;
    let retryTimeout;

    const connectSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource("/api/notifications/stream");

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
        // Clear any existing retry timeout
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
        // Attempt to reconnect after 10 seconds
        retryTimeout = setTimeout(connectSSE, 10000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  useEffect(() => {
    let eventSource;

    const connectNavbarSSE = () => {
      eventSource = new EventSource("/api/navbarInfo");

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setUserInfo(data.user);
      };

      eventSource.onerror = (error) => {
        console.error("NavbarInfo EventSource failed:", error);
        eventSource.close();
        // Attempt to reconnect after 5 seconds
        setTimeout(connectNavbarSSE, 5000);
      };
    };

    connectNavbarSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

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
            className="hidden sm:flex items-center gap-4 bg-gradient-to-r from-[#F8FAFC]/80 to-white/80 px-5 py-2.5 rounded-xl shadow-sm backdrop-blur-sm text-sm ml-4 cursor-pointer border border-[#0B6EC9]/10 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#0B6EC9]/20 overflow-hidden">
              <Image
                src={userInfo.profilePicture || "/noProfile.png"}
                alt={userInfo.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[#062341] font-semibold line-clamp-1">
                {userInfo.name}
              </h2>
              <span className="text-sm text-[#0B6EC9]/80 capitalize font-medium">
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
            unreadCount={unreadCount}
            onNotificationClick={(type) => {
              setIsNotificationsOpen(false);
              onPageChange(type);
            }}
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
