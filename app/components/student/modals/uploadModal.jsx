import { motion } from "framer-motion";
import { FaTimes, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";

const UploadModal = ({
  toggleUploadModal,
  inputFileRef,
  uploadImage,
  uploading,
  handleFileChange,
  isFileSelected,
  setUploadModal,
  setIsFileSelected,
}) => {
  const validateFileType = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
      "image/gif",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleFileChangeWithValidation = (event) => {
    const file = event.target.files[0];
    if (file && validateFileType(file)) {
      handleFileChange(event);
    } else {
      event.target.value = null;
      setIsFileSelected(false);
      alert("Please select a valid image file (PNG, JPG, SVG, WEBP, or GIF).");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-[#0B6EC9]/10 w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Upload Profile Picture
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setUploadModal(false);
              setIsFileSelected(false);
            }}
            className="text-white hover:text-red-100 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={uploadImage} className="p-6 space-y-6 bg-white">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#062341]">
              <FaCloudUploadAlt className="text-[#0B6EC9] text-xl" />
              Choose Image
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <input
                onChange={handleFileChangeWithValidation}
                ref={inputFileRef}
                type="file"
                required
                accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
                className="w-full px-4 py-3 bg-white rounded-xl border border-[#0B6EC9]/20 focus:border-[#0B6EC9]/50 focus:ring-2 focus:ring-[#0B6EC9]/20 outline-none transition-all duration-300 shadow-sm
                file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold
                file:bg-[#0B6EC9] file:text-white
                hover:file:bg-[#095396]
                file:transition-colors"
              />
            </motion.div>
            <p className="text-xs text-[#062341]/70 mt-2">
              Supported formats: PNG, JPG, SVG, WEBP, GIF
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={uploading || !isFileSelected}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                !uploading && isFileSelected
                  ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] hover:from-[#095396] hover:to-[#084B87] text-white shadow-md"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="h-5 w-5" />
                  <span>Upload</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;
