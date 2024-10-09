import { useState } from "react";
import QuestionModal from "../modals/appraisal/questionModal";
import RecordedAppraisal from "../modals/appraisal/recordedAppraisal";
import { FaArrowRight } from "react-icons/fa";

const Appraisal = () => {
  const [appraisalModal, setAppraisalModal] = useState(true);
  const [recentAppraisal, setRecentAppraisal] = useState(false);
  const [academicAssessment, setAcademicAssessment] = useState(null);
  const [socioEmotional, setSocioEmotional] = useState(null);
  const [careerExploration, setCareerExploration] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const startAppraisal = async () => {
    setLoadingQuestion(true);

    try {
      const response = await fetch("/questions.json");
      const { academicAssessment, socioEmotional, careerExploration } =
        await response.json();

      setAcademicAssessment(academicAssessment.questions);
      setSocioEmotional(socioEmotional.questions);
      setCareerExploration(careerExploration.questions);
    } catch (error) {
      console.error("Error Fetching Question");
    }

    setLoadingQuestion(false);
    setRecentAppraisal(false);
    setAppraisalModal(!appraisalModal);
  };

  return (
    <>
      {appraisalModal ? (
        <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
          <div className="flex xl:text-[15pt] 2xl:text-[20pt] font-extrabold w-[50%] justify-evenly">
            <span
              onClick={() => {
                setAppraisalModal(false);
                setRecentAppraisal(true);
              }}
              className={`w-[50%] ${
                recentAppraisal ? "text-[#062341] underline" : "text-[#818487]"
              }  text-center border-r-[2px] border-[#062341] cursor-pointer`}
            >
              Past Appraisal
            </span>
            <span
              onClick={() => {
                setRecentAppraisal(false);
                setAppraisalModal(true);
              }}
              className={`w-[50%] ${
                appraisalModal ? "text-[#062341] underline" : "text-[#818487]"
              }  text-center border-l-[2px] border-[#062341] cursor-pointer`}
            >
              Start Appraisal
            </span>
          </div>
          <div className="intro flex flex-col text-[#1a365d] xl:text-[10pt] 2xl:text-[15pt] font-semibold justify-center w-[70%] h-[70%] gap-[10%]">
            <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <span className="text-[#2c5282] mb-2">
                Academic Self Assessment
              </span>
              <span className="text-[#4a5568] font-normal text-center">
                Evaluate academic strengths, weaknesses, and goals.
              </span>
            </div>
            <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <span className="text-[#2c5282] mb-2">
                Social-Emotional Well-being
              </span>
              <span className="text-[#4a5568] font-normal text-center">
                Evaluate emotional state, social skills, and stress coping.
              </span>
            </div>
            <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <span className="text-[#2c5282] mb-2">Career Exploration</span>
              <span className="text-[#4a5568] font-normal text-center">
                Evaluate career interests for further exploration.
              </span>
            </div>
          </div>
          <button
            onClick={startAppraisal}
            className="xl:h-[8%] 2xl:w-[25%] 2xl:h-[10%] px-8 xl:px-2 2xl:py-3 min-w-[150px] text-center text-[#EAF1F9] font-semibold bg-[#265E99] border-2 border-[#265E99] rounded-[15px] shadow-md transition-all duration-300 active:scale-95 hover:bg-[#1a4a7c] hover:border-[#1a4a7c] focus:outline-none focus:ring-2 focus:ring-[#265E99] focus:ring-opacity-50"
          >
            <span className="mr-2">Start Appraisal</span>
            <FaArrowRight className="inline-block xl:h-3 xl:w-3 2xl:h-5 2xl:w-5" />
          </button>
        </div>
      ) : recentAppraisal ? (
        <RecordedAppraisal
          setAppraisalModal={setAppraisalModal}
          setRecentAppraisal={setRecentAppraisal}
          recentAppraisal={recentAppraisal}
          appraisalModal={appraisalModal}
        />
      ) : (
        <QuestionModal
          academicAssessment={academicAssessment}
          socioEmotional={socioEmotional}
          careerExploration={careerExploration}
        />
      )}
    </>
  );
};

export default Appraisal;
