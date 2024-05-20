const StudentAppraisal = () => {
  return (
    <div className="absolute w-[55%] h-[83vh] bg-[#E6F0F9] right-[22.5%] bottom-[2%] rounded-[20px] flex flex-col items-center p-[50px] gap-5">
      <div className="text-[#062341] text-[15pt] font-semibold">
        <span className="cursor-pointer">Past Appraisal </span>|
        <span className="cursor-pointer"> Start Appraisal</span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3">
        <span className="font-bold">Academic Self Assessment</span>
        <span className="text-[#818487]">
          Evaluate academic strengths, weaknesses, and goals.
        </span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3">
        <span className="font-bold">Social-Emotional Well-being</span>
        <span className="text-[#818487]">
          Evaluate emotional state, social skills, and stress coping.
        </span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3">
        <span className="font-bold">Social-Emotional Well-being</span>
        <span className="text-[#818487]">
          Evaluate career interests and identify areas for further exploration.
        </span>
      </div>
    </div>
  );
};

export default StudentAppraisal;
