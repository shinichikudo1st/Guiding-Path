import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

const QuickView = () => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleQuickView = () => {
    setIsQuickViewOpen(!isQuickViewOpen);
  };

  const ToggleButton = () => (
    <button
      onClick={toggleQuickView}
      className="fixed right-4 bottom-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-lg md:hidden"
    >
      {isQuickViewOpen ? <FaTimes /> : <FaBars />}
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {(isQuickViewOpen || isDesktop) && (
          <motion.aside
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            exit={{ x: 280 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-0 top-20 h-[calc(100vh-5rem)] w-64 bg-gradient-to-b from-[#E6F0F9] to-[#F8FAFC] p-4 overflow-y-auto shadow-lg z-40
              ${isQuickViewOpen ? "block" : "hidden md:block"}`}
          >
            <div className="flex flex-col gap-4">
              {/* Content will go here */}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <ToggleButton />
    </>
  );
};

export default QuickView;
