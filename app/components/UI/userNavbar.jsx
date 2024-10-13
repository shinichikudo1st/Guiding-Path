import { BsGearFill, BsBellFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import OpenSettings from "./openSettings";
import OpenLogout from "./openLogout";
import Notifications from "./notifications";

const UserNavbar = () => {
  const [isLogoutToggled, setIsLogoutToggled] = useState(false);
  const [isSettingsToggled, setIsSettingsToggled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    const response = await fetch("/api/notificationOption");
    if (response.ok) {
      const data = await response.json();
      setUnreadCount(data.notifications.filter((n) => !n.isRead).length);
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

  const iconSize =
    "text-[20pt] cursor-pointer 2xl:translate-x-[130px] hover:scale-110 hover:text-[#0B6EC9] hover:duration-[0.3s]";

  const handleNotificationChange = () => {
    fetchUnreadCount();
  };

  return (
    <nav className="absolute w-full h-[10vh] flex items-center justify-between px-5 2xl:h-[8vh]">
      <h1 className=" text-[#062341] font-bold text-[25pt]">Guiding Path</h1>
      <div className="flex w-[40%] h-[10vh] justify-center items-center gap-6 text-[#062341]">
        <div className="relative">
          <BsBellFill
            className={`${iconSize} ${
              isNotificationsOpen ? "text-[#0B6EC9]" : ""
            }`}
            onClick={toggleNotifications}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-2 translate-x-[140px] bg-red-500 text-[#E6F0F9] rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
          <Notifications
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNotificationChange={handleNotificationChange}
          />
        </div>
        <BsGearFill
          className={`${iconSize} ${isSettingsToggled ? "text-[#0B6EC9]" : ""}`}
          onClick={toggleSettings}
        />
        <span
          className={`text-[16pt] font-bold translate-x-[60px] cursor-pointer 2xl:translate-x-[200px] hover:text-[#0B6EC9] hover:scale-105 hover:duration-[0.3s] select-none ${
            isLogoutToggled ? "text-[#0B6EC9]" : ""
          }`}
          onClick={toggleLogout}
        >
          LOGOUT
        </span>
        {isSettingsToggled && <OpenSettings />}
        {isLogoutToggled && (
          <OpenLogout setisLogoutToggled={setIsLogoutToggled} logout={logout} />
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
