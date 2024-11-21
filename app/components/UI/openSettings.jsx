import { useState } from "react";
import { FiLock } from "react-icons/fi";
import ChangePassword from "./changePassword";
import { motion } from "framer-motion";

const OpenSettings = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-[90vw] sm:w-[300px] bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
      style={{ top: "calc(100% + 0.5rem)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] px-6 py-4">
        <h2 className="text-lg font-bold text-white">Settings</h2>
      </div>

      {/* Settings Items */}
      <div className="p-4 space-y-3">
        <SettingItem
          icon={<FiLock className="text-[#0B6EC9]" />}
          text="Change Password"
          onClick={() => setShowChangePassword(true)}
        />
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </motion.div>
  );
};

const SettingItem = ({ icon, text, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center p-4 rounded-xl bg-white hover:bg-[#F8FAFC] cursor-pointer transition-all duration-300 shadow-sm hover:shadow border border-[#0B6EC9]/10"
    onClick={onClick}
  >
    <span className="mr-4 text-xl">{icon}</span>
    <span className="font-medium text-[#062341]">{text}</span>
  </motion.div>
);

export default OpenSettings;
