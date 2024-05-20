import { FaBell, FaBookOpen, FaUserCircle, FaUserClock } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";

const StudentSidebar = ({ appraisal, otherButton }) => {
  return (
    <aside className="absolute w-[20%] h-[90vh] bg-[#E6F0F9] translate-y-[75px] text-[#062341] p-[20px] text-[12pt] flex flex-col items-center gap-[25px] pt-[30px]">
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={otherButton}
      >
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={otherButton}
      >
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={otherButton}
      >
        <FaBell className="text-[30pt]" />
        <span>Announcements</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={otherButton}
      >
        <FaBookOpen className="text-[30pt]" />
        <span>Resources</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={appraisal}
      >
        <BsChatFill className="text-[30pt]" />
        <span>Appraisal</span>
      </div>
    </aside>
  );
};

export default StudentSidebar;
