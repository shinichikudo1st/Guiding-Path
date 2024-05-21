const StudentAppraisal = ({ start }) => {
  return (
    <div className="absolute w-[55%] h-[83vh] bg-[#E6F0F9] right-[22.5%] bottom-[2%] 2xl:bottom-[5%] rounded-[20px] flex flex-col items-center p-[50px] gap-5">
      <div className="text-[#062341] text-[15pt] font-semibold">
        <span className="cursor-pointer">Past Appraisal </span>|
        <span className="cursor-pointer"> Start Appraisal</span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3 2xl:mt-[100px]">
        <span className="font-bold">Academic Self Assessment</span>
        <span className="text-[#818487]">
          Evaluate academic strengths, weaknesses, and goals.
        </span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3 2xl:mt-[100px]">
        <span className="font-bold">Social-Emotional Well-being</span>
        <span className="text-[#818487]">
          Evaluate emotional state, social skills, and stress coping.
        </span>
      </div>
      <div className="text-[#062341] text-[13pt] w-[90%] mt-8 flex flex-col items-center gap-3 2xl:mt-[100px]">
        <span className="font-bold">Student Career Exploration</span>
        <span className="text-[#818487]">
          Evaluate career interests and identify areas for further exploration.
        </span>
      </div>
      <button
        className=" 2xl:mt-8 2xl:w-[200px] 2xl:h-[50px] bg-[#0B6EC9] rounded-[10px] text-[#E6F0F9] font-semibold hover:scale-105 hover:duration-[0.3s]"
        onClick={start}
      >
        Start Appraisal
      </button>
    </div>
  );
};

export default StudentAppraisal;
