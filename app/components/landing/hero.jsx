import { motion } from "framer-motion";
import Image from "next/image";
import { FaGraduationCap, FaArrowRight } from "react-icons/fa";

const Hero = ({ onGetStarted }) => {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ zIndex: 2 }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left max-w-2xl"
          >
            <div className="relative bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-[#0B6EC9]/10">
              {/* Graduation Cap Icon */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-10"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-all duration-300">
                  <FaGraduationCap className="text-white text-3xl" />
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-[#0B6EC9] to-[#062341] rounded-full"></div>
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight pl-4">
                  <span className="text-[#062341] block mb-2">
                    Guiding Your
                  </span>
                  <span className="text-[#062341] block mb-2">Path to</span>
                  <span className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-transparent bg-clip-text block mb-2">
                    Academic
                  </span>
                  <span className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-transparent bg-clip-text">
                    Success
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <p className="text-lg text-[#062341]/80 bg-white/50 rounded-2xl p-6 shadow-inner border border-[#0B6EC9]/5">
                  Connect with counselors, track your progress, and achieve your
                  academic goals with our comprehensive student guidance
                  platform.
                </p>
              </motion.div>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px -10px rgba(11, 110, 201, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-semibold hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                >
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 20px -10px rgba(6, 35, 65, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-[#062341] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all duration-300 border-2 border-[#0B6EC9]/20 shadow-md"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Logo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/80 rounded-3xl blur-xl"></div>
              <Image
                src="/hero-image.jpg"
                alt="CTU Guidance Logo"
                width={400}
                height={400}
                className="relative rounded-3xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
