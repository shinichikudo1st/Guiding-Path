import { useState } from "react";
import { FaTimes, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const UnarchiveUser = ({ userId, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleUnarchive = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/archiveUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to unarchive user");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-blue-500"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </motion.button>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center mb-6"
        >
          <FaExclamationTriangle className="text-green-500 mr-4" size={32} />
          <h2 className="text-3xl font-bold text-gray-800">Unarchive User</h2>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Are you sure you want to unarchive this user? This will restore their
          access to the system.
        </motion.p>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mb-4"
          >
            {error}
          </motion.div>
        )}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUnarchive}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
          >
            {isSubmitting && (
              <FaSpinner className="animate-spin inline-block mr-2" />
            )}
            {isSubmitting ? "Unarchiving..." : "Unarchive User"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UnarchiveUser;
