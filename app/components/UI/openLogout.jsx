import { motion } from "framer-motion";

const OpenLogout = ({ setisLogoutToggled, logout }) => {
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
        <h2 className="text-lg font-bold text-white">Confirm Logout</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-[#062341] text-center mb-6 font-medium">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-center items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setisLogoutToggled(false)}
            className="px-6 py-2.5 text-sm font-medium text-[#062341] bg-white hover:bg-[#F8FAFC] rounded-xl border border-[#0B6EC9]/20 shadow-sm hover:shadow transition-all duration-300"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#0B6EC9] to-[#095396] hover:from-[#095396] hover:to-[#084B87] rounded-xl shadow-sm hover:shadow transition-all duration-300"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OpenLogout;
