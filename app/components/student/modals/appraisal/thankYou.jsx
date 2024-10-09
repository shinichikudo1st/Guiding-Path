import { GiPartyFlags, GiPartyPopper } from "react-icons/gi";

const ThankYouModal = ({ refresh }) => {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center z-10 font-sans">
      <div className="absolute w-[100%] h-[100%] bg-black opacity-90 z-20"></div>
      <div className="bg-[#dfecf6] h-[50%] w-[50%] z-30 rounded-[20px] flex flex-col items-center py-[5%] gap-[20%]">
        <GiPartyFlags className="text-[#1A5590] xl:text-[30pt] 2xl:text-[50pt] absolute mr-[40%]" />
        <GiPartyFlags className="text-[#1A5590] xl:text-[30pt] 2xl:text-[50pt] absolute ml-[40%]" />
        <GiPartyPopper className="text-[#1A5590] xl:text-[30pt] 2xl:text-[50pt] absolute mr-[40%] mt-[15%]" />
        <GiPartyPopper className="text-[#1A5590] xl:text-[30pt] 2xl:text-[50pt] absolute ml-[40%] mt-[15%] transform -scale-x-[1]" />

        <span className="xl:text-[20pt] 2xl:text-[25pt] font-bold">
          Thank You for completing the Appraisal!
        </span>
        <p className=" mx-[10%] text-justify xl:text-[12pt] 2xl:text-[15pt] leading-loose font-semibold">
          Your answers will help assess various areas and provide insights for
          counselors. Our goal is to support you in creating a comfortable
          environment at Cebu Technological University and assist with your
          future endeavors!
        </p>
        <button
          onClick={refresh}
          className="absolute mt-[15%] w-[10%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span className="relative w-[100%] px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Done
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
