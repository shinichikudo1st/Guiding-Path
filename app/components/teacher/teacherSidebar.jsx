import { FaEdit, FaFile, FaUserCircle, FaUserClock } from "react-icons/fa";

const TeacherSidebar = ({ profile, appointment, referral, resource }) => {
  return (
    <aside className="absolute w-[20%] h-[90vh] bg-[#E6F0F9] translate-y-[75px] text-[#062341] p-[20px] text-[12pt] flex flex-col items-center gap-[25px] 2xl:gap-[50px] 2xl:p-[50px] pt-[30px]">
      <div
        onClick={profile}
        className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]"
      >
        <FaUserCircle className="text-[30pt]" />
        <span>My Profile</span>
      </div>
      <div className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]">
        <FaUserClock className="text-[30pt]" />
        <span>Appointments</span>
      </div>
      <div className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]">
        <FaEdit className="text-[30pt]" />
        <span>Referrals</span>
      </div>
      <div className="flex items-center font-bold border-b-[1px] border-[#75818C] gap-4 2xl:gap-6 w-[230px] h-[55px] pl-5 cursor-pointer hover:text-[#0B6EC9] hover:duration-[0.4s]">
        <FaFile className="text-[30pt]" />
        <span>Resources</span>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
