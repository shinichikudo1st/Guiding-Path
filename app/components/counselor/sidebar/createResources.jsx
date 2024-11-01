import { useState } from "react";
import CreateEvent from "../modals/create/createEvent";
import CreateAnnouncement from "../modals/create/createAnnouncement";
import CreateResource from "../modals/create/createResource";

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
    <>
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex flex-col items-center px-[4%] pt-[3%] gap-[5%]">
        <div className="flex w-[100%] justify-evenly select-none bg-white rounded-full shadow-md">
          <span
            onClick={toggleEvents}
            className={`text-[16pt] w-[33%] py-2 ${
              events ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-l-full font-bold`}
          >
            Events
          </span>
          <span
            onClick={toggleAnnouncements}
            className={`text-[16pt] w-[33%] py-2 ${
              announcements ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold`}
          >
            Announcements
          </span>
          <span
            onClick={toggleResources}
            className={`text-[16pt] w-[33%] py-2 ${
              resources ? "bg-[#0B6EC9] text-white" : "text-[#818487]"
            } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center rounded-r-full font-bold`}
          >
            Resources
          </span>
        </div>
        {events && <CreateEvent />}
        {announcements && <CreateAnnouncement />}
        {resources && <CreateResource />}
      </div>
    </>
  );
};

export default CreateResources;
