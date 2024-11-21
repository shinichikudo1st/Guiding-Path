import { useState } from "react";
import CreateEvent from "../modals/create/createEvent";
import CreateAnnouncement from "../modals/create/createAnnouncement";
import CreateResource from "../modals/create/createResource";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const CreateResources = () => {
  const [events, setEvents] = useState(false);
  const [announcements, setAnnouncements] = useState(true);
  const [resources, setResources] = useState(false);

  const toggleEvents = () => {
    setAnnouncements(false);
    setResources(false);
    setEvents(true);
  };

  const toggleAnnouncements = () => {
    setEvents(false);
    setResources(false);
    setAnnouncements(true);
  };

  const toggleResources = () => {
    setAnnouncements(false);
    setEvents(false);
    setResources(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FaPlus className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Create Resources
              </h1>
            </div>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex w-full justify-evenly select-none bg-white rounded-full shadow-md">
              <span
                onClick={toggleEvents}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  events ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-l-full font-bold`}
              >
                Events
              </span>
              <span
                onClick={toggleAnnouncements}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  announcements ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold`}
              >
                Announcements
              </span>
              <span
                onClick={toggleResources}
                className={`text-base sm:text-lg w-1/3 py-3 ${
                  resources ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
                } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-r-full font-bold`}
              >
                Resources
              </span>
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh]">
              {events && <CreateEvent />}
              {announcements && <CreateAnnouncement />}
              {resources && <CreateResource />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateResources;
