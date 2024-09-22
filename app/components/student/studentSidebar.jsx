import { FaBell, FaBookOpen, FaUserCircle, FaUserClock } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";

const StudentSidebar = ({
  viewProfile,
  viewAppraisal,
  viewAppointment,
  viewAnnouncement,
  activeComponent,
  viewResources,
}) => {
  const getItemClassName = (itemName) => {
    const baseClass =
      "flex items-center font-bold gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer transition-all duration-300 border-l-4 border-transparent border-b-[1px] border-b-[#75818C]";
    return `${baseClass} ${
      activeComponent === itemName
        ? "border-l-[#0B6EC9] bg-[#F0F7FD] text-[#0B6EC9]"
        : "hover:bg-[#D1E5F7] hover:text-[#0B6EC9]"
    }`;
  };

  return (
    <aside className="absolute w-[20%] h-[90vh] bg-[#E6F0F9] translate-y-[75px] text-[#062341] p-[20px] text-[12pt] flex flex-col items-center gap-[25px] 2xl:gap-[50px] 2xl:p-[50px] pt-[30px]">
      <div className={getItemClassName("profile")} onClick={viewProfile}>
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div
        className={getItemClassName("appointment")}
        onClick={viewAppointment}
      >
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div
        className={getItemClassName("announcement")}
        onClick={viewAnnouncement}
      >
        <FaBell className="text-[30pt]" />
        <span>Announcements</span>
      </div>
      <div className={getItemClassName("resources")} onClick={viewResources}>
        <FaBookOpen className="text-[30pt]" />
        <span>Resources</span>
      </div>
      <div className={getItemClassName("appraisal")} onClick={viewAppraisal}>
        <BsChatFill className="text-[30pt]" />
        <span>Appraisal</span>
      </div>
    </aside>
  );
};

export default StudentSidebar;
