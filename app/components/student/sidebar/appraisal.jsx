import { useState } from "react";
import QuestionModal from "../modals/questionModal";
import RecordedAppraisal from "../modals/recordedAppraisal";

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
        <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
          <div className="flex text-[20pt] font-extrabold w-[50%] justify-evenly">
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
          <div className="flex flex-col text-[#062341] text-[15pt] font-bold justify-center w-[70%] h-[70%] gap-[25%]">
            <div className="flex flex-col justify-center items-center">
              <span>Academic Self Assessment</span>
              <span className="text-[#818487] font-medium">
                Evaluate academic strengths, weaknesses, and goals.
              </span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span>Social-Emotional Well-being</span>
              <span className="text-[#818487] font-medium">
                Evaluate emotional state, social skills, and stress coping.
              </span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span>Career Exploration</span>
              <span className="text-[#818487] font-medium">
                Evaluate career interests for further exploration.
              </span>
            </div>
          </div>
          <button
            onClick={startAppraisal}
            className="w-[20%] h-[8%] px-6 py-2 min-w-[120px] text-center text-[#EAF1F9] font-medium bg-[#265E99] border border-[#265E99] rounded-[10px] active:text-[#265E99] hover:bg-transparent hover:text-[#265E99] focus:outline-none focus:ring"
          >
            Start Appraisal
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
