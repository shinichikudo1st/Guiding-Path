import { FaEdit, FaFile, FaUserCircle, FaUserClock } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { MdGroups, MdManageAccounts } from "react-icons/md";

const CounselorSidebar = ({
  otherButton,
  userManagement,
  generateReport,
  appointment,
}) => {
  return (
    <aside className="absolute w-[20%] h-[90vh] bg-[#E6F0F9] translate-y-[75px] text-[#062341] p-[20px] text-[12pt] flex flex-col items-center gap-[25px] 2xl:gap-[50px] 2xl:p-[50px] pt-[30px]">
      <div
        onClick={otherButton}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div
        onClick={appointment}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div
        onClick={userManagement}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <MdManageAccounts className="text-[30pt]" />
        <span>User Management</span>
      </div>
      <div
        onClick={otherButton}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaEdit className="text-[30pt]" />
        <span>Create & Edit</span>
      </div>
      <div
        onClick={generateReport}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaFile className="text-[30pt]" />
        <span>Reports</span>
      </div>
      <div
        onClick={otherButton}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaGear className="text-[30pt]" />
        <span>System Settings</span>
      </div>
      <div
        onClick={otherButton}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <MdGroups className="text-[30pt]" />
        <span>Referrals</span>
      </div>
    </aside>
  );
};

export default CounselorSidebar;
