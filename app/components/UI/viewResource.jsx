import React from "react";
import {
  FaTimes,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaClock,
  FaLink,
} from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

const ResourceModal = ({ resource, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 w-full max-w-3xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{resource.title}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all duration-300"
            >
              <FaTimes size={24} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#dfecf6] max-h-[calc(100vh-16rem)]">
          <div className="p-6 space-y-6">
            {resource.img_path && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full h-80 rounded-xl overflow-hidden shadow-md"
              >
                <Image
                  src={resource.img_path}
                  alt={resource.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-[#dfecf6] pr-2">
                <p className="text-[#062341]/70 text-base sm:text-lg whitespace-pre-wrap leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#062341]/70 pt-2 border-t border-[#0B6EC9]/10">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-[#0B6EC9]" />
                  <span>
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2 text-[#0B6EC9]" />
                  <span>
                    {new Date(resource.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {resource.link && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-semibold hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md"
                >
                  <FaLink />
                  Visit Resource
                  <FaExternalLinkAlt className="text-sm" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResourceModal;
