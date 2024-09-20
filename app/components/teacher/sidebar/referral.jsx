import { useState } from "react";
import ReferStudent from "../modals/referStudent";
import ViewReferrals from "../modals/viewReferrals";

const TeacherReferral = () => {
  const [activeTab, setActiveTab] = useState("viewReferrals");

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center px-[4%] pt-[3%] gap-[5%]">
      <div className="flex w-[100%] justify-evenly select-none bg-[#E6F0F9] rounded-full p-1">
        <button
          onClick={() => toggleTab("viewReferrals")}
          className={`text-[16pt] w-[50%] py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
            activeTab === "viewReferrals"
              ? "bg-[#0B6EC9] text-white shadow-md"
              : "text-[#062341] hover:bg-[#D9E7F3]"
          } font-bold`}
        >
          View Referrals
        </button>
        <button
          onClick={() => toggleTab("referStudent")}
          className={`text-[16pt] w-[50%] py-2 px-4 rounded-full transition-all duration-300 ease-in-out ${
            activeTab === "referStudent"
              ? "bg-[#0B6EC9] text-white shadow-md"
              : "text-[#062341] hover:bg-[#D9E7F3]"
          } font-bold`}
        >
          Refer Student
        </button>
      </div>
      {activeTab === "referStudent" && <ReferStudent />}
      {activeTab === "viewReferrals" && <ViewReferrals />}
    </div>
  );
};

export default TeacherReferral;
