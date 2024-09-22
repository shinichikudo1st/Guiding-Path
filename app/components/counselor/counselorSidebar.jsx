import { FaEdit, FaFile, FaUserCircle, FaUserClock } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdGroups, MdManageAccounts } from "react-icons/md";

const CounselorSidebar = ({
  otherButton,
  userManagement,
  generateReport,
  appointment,
  profile,
  create,
  referral,
  activeComponent,
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
      <div className={getItemClassName("profile")} onClick={profile}>
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div className={getItemClassName("appointment")} onClick={appointment}>
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div
        className={getItemClassName("userManagement")}
        onClick={userManagement}
      >
        <MdManageAccounts className="text-[30pt]" />
        <span>User Management</span>
      </div>
      <div className={getItemClassName("create")} onClick={create}>
        <FaEdit className="text-[30pt]" />
        <span>Create & Edit</span>
      </div>
      <div
        className={getItemClassName("generateReport")}
        onClick={generateReport}
      >
        <FaFile className="text-[30pt]" />
        <span>Reports</span>
      </div>
      <div className={getItemClassName("settings")} onClick={otherButton}>
        <FaGear className="text-[30pt]" />
        <span>System Settings</span>
      </div>
      <div className={getItemClassName("referral")} onClick={referral}>
        <MdGroups className="text-[30pt]" />
        <span>Referrals</span>
      </div>
    </aside>
  );
};

export default CounselorSidebar;
