import { useState } from "react";
import CreateEvent from "../modals/createEvent";
import CreateAnnouncement from "../modals/createAnnouncement";

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
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center px-[4%] pt-[3%] gap-[5%]">
        <div className="flex w-[100%] justify-evenly select-none">
          <span
            onClick={toggleEvents}
            className={`text-[16pt] w-[33%] ${
              !events ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-r-[3px] border-[#062341] font-bold`}
          >
            Events
          </span>
          <span
            onClick={toggleAnnouncements}
            className={`text-[16pt] w-[33%] ${
              !announcements ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center font-bold`}
          >
            Announcements
          </span>
          <span
            onClick={toggleResources}
            className={`text-[16pt] w-[33%] ${
              !resources ? "text-[#818487]" : "text-[#0B6EC9]"
            } cursor-pointer hover:text-[#0B6EC9] duration-[0.2s] hover:text-[17pt] text-center border-l-[3px] border-[#062341] font-bold`}
          >
            Resources
          </span>
        </div>
        {events && <CreateEvent />}
        {announcements && <CreateAnnouncement />}
      </div>
    </>
  );
};

export default CreateResources;
