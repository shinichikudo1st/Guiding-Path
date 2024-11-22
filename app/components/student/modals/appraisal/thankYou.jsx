import { GiPartyFlags, GiPartyPopper } from "react-icons/gi";
import { motion } from "framer-motion";

const ThankYouModal = ({ refresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center z-[100]"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden z-[110]"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Appraisal Complete
          </h2>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          <div className="relative">
            <GiPartyFlags className="absolute text-[#0B6EC9]/40 text-4xl sm:text-5xl -left-4 top-0" />
            <GiPartyFlags className="absolute text-[#0B6EC9]/40 text-4xl sm:text-5xl -right-4 top-0" />
            <GiPartyPopper className="absolute text-[#0B6EC9]/40 text-4xl sm:text-5xl -left-4 bottom-0" />
            <GiPartyPopper className="absolute text-[#0B6EC9]/40 text-4xl sm:text-5xl -right-4 bottom-0 transform -scale-x-100" />

            <div className="text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#062341]">
                Thank You for completing the Appraisal!
              </h3>
              <p className="text-base sm:text-lg text-[#062341]/70 max-w-3xl mx-auto leading-relaxed">
                Your answers will help assess various areas and provide insights
                for counselors. Our goal is to support you in creating a
                comfortable environment at Cebu Technological University and
                assist with your future endeavors!
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={refresh}
              className="px-8 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md"
            >
              Done
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThankYouModal;
