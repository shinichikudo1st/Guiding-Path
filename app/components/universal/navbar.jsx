import { motion } from "framer-motion";
import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";

const Navbar = ({ login, signup }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden bg-transparent">
                <Image
                  src={ctuLogo}
                  alt="CTU Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-full"
                  priority
                />
              </div>
              <h1 className="text-[#062341] font-bold text-xl sm:text-2xl md:text-3xl">
                Guiding Path
              </h1>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={login}
                className="px-4 py-2 sm:px-6 text-sm sm:text-base font-semibold text-[#062341] hover:text-[#0B6EC9] bg-gradient-to-br from-white/80 to-[#F8FAFC]/80 hover:from-white hover:to-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-[#0B6EC9]/10"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signup}
                className="px-4 py-2 sm:px-6 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#0B6EC9] to-[#095396] hover:from-[#095396] hover:to-[#084B87] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Signup
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
