import { useState } from "react";
import { FiLock } from "react-icons/fi";
import ChangePassword from "./changePassword";

const OpenSettings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="absolute w-[250px] h-[300px] z-10 right-[10%] top-16 rounded-[10px] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg flex flex-col items-center pt-[20px] text-[#062341]">
      <h2 className="text-xl font-bold mb-6 text-[#0b6ec9]">Settings</h2>
      <div className="w-full px-6 space-y-4">
        <SettingItem
          icon={<FiLock className="text-blue-600" />}
          text="Change Password"
          onClick={() => setShowChangePassword(true)}
        />
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

const SettingItem = ({ icon, text, onClick }) => (
  <div
    className="flex items-center p-3 rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-all duration-300 shadow-sm hover:shadow"
    onClick={onClick}
  >
    <span className="mr-4 text-xl">{icon}</span>
    <span className="font-medium">{text}</span>
  </div>
);

export default OpenSettings;
