import noProfile from "@/public/noProfile.png";
import ProgressiveImage from "@/app/components/UI/progressiveImage";
import { FaCamera } from "react-icons/fa";
import { motion } from "framer-motion";

const UploadProfilePicture = ({ toggleUploadModal, picture }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[#0B6EC9] to-[#095396] p-0.5">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <ProgressiveImage
              alt="Profile Picture"
              src={picture ? picture : noProfile.src}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleUploadModal}
          className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
        >
          <FaCamera className="text-sm sm:text-base md:text-lg" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UploadProfilePicture;
