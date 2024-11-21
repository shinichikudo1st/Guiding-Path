import { motion } from "framer-motion";

const QuickView = () => {
  return (
    <motion.aside
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg md:translate-x-0 transition-transform duration-300 translate-x-full sm:translate-x-0"
    >
      <div className="flex flex-col gap-4">{/* Content will go here */}</div>
    </motion.aside>
  );
};

export default QuickView;
