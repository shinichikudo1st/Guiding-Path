import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const DeleteConfirmation = ({ appraisal, onConfirm, onCancel, isDeleting }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <div className="flex items-center gap-4 text-red-600 mb-4">
          <FaExclamationTriangle className="text-2xl" />
          <h3 className="text-xl font-semibold">Delete Appraisal Template</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#062341]">
              "{appraisal.title}"
            </span>
            ?
          </p>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">This action will:</p>
            <ul className="mt-2 space-y-1 text-sm text-red-600">
              <li>• Delete all questions and categories</li>
              <li>• Remove all evaluation criteria</li>
              <li>• Delete all student responses</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 justify-end pt-4">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>Delete Template</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteConfirmation;
