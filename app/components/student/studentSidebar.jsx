import { FaBell, FaBookOpen, FaUserCircle, FaUserClock } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";

const StudentSidebar = ({
  otherButton,
  viewProfile,
  viewAppraisal,
  viewAppointment,
  viewAnnouncement,
}) => {
  return (
    <aside className="absolute w-[20%] h-[90vh] bg-[#E6F0F9] translate-y-[75px] text-[#062341] p-[20px] text-[12pt] flex flex-col items-center gap-[25px] 2xl:gap-[50px] 2xl:p-[50px] pt-[30px]">
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={viewProfile}
      >
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={viewAppointment}
      >
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={viewAnnouncement}
      >
        <FaBell className="text-[30pt]" />
        <span>Announcements</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={otherButton}
      >
        <FaBookOpen className="text-[30pt]" />
        <span>Resources</span>
      </div>
      <div
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
        onClick={viewAppraisal}
      >
        <BsChatFill className="text-[30pt]" />
        <span>Appraisal</span>
      </div>
    </aside>
  );
};

export default StudentSidebar;
