import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import ChatbotModal from "./chatBotModal";

const ChatbotButton = ({ sessionData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div
        className="fixed bottom-6 right-6"
        style={{
          zIndex: 999999,
          pointerEvents: "auto",
          position: "fixed",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(11, 110, 201, 0.4)",
                "0 0 0 20px rgba(11, 110, 201, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-full"
            style={{ pointerEvents: "none" }}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white 
            shadow-lg shadow-[#0B6EC9]/20 flex items-center justify-center relative overflow-hidden 
            hover:shadow-xl hover:shadow-[#0B6EC9]/30 transition-all duration-300"
            style={{ pointerEvents: "auto" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ pointerEvents: "none" }}
            />
            <FaRobot className="text-3xl relative z-10" />
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <ChatbotModal
            sessionData={sessionData}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotButton;
