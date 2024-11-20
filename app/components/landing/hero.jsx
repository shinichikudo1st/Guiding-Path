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
            <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
              {/* Graduation Cap Icon */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="w-14 h-14 bg-[#0B6EC9] rounded-2xl flex items-center justify-center">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                  <span className="text-[#062341]">Guiding Your</span>
                  <br />
                  <span className="text-[#062341]">Path to</span>
                  <br />
                  <span className="text-[#0B6EC9]">Academic</span>
                  <br />
                  <span className="text-[#0B6EC9]">Success</span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <p className="text-lg text-[#062341]/80 bg-[#F8FAFC]/80 rounded-2xl p-4">
                  Connect with counselors, track your progress, and achieve your
                  academic goals with our comprehensive student guidance
                  platform.
                </p>
              </motion.div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className="group px-6 py-3 bg-[#0B6EC9] text-white rounded-xl font-semibold hover:bg-[#095396] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Get Started
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white text-[#062341] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all duration-300 border border-[#0B6EC9]/20"
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
