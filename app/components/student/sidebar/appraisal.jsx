import { useState } from "react";
import QuestionModal from "../modals/appraisal/questionModal";
import RecordedAppraisal from "../modals/appraisal/recordedAppraisal";
import { motion } from "framer-motion";

const Appraisal = () => {
  const [activeTab, setActiveTab] = useState("start");
  const [academicAssessment, setAcademicAssessment] = useState(null);
  const [socioEmotional, setSocioEmotional] = useState(null);
  const [careerExploration, setCareerExploration] = useState(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const tabs = [
    { id: "past", label: "Past Appraisal" },
    { id: "start", label: "Start Appraisal" },
  ];

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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Self-Appraisal
            </h1>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {/* Navigation Tabs */}
            <div className="flex w-full justify-evenly select-none bg-white rounded-full shadow-md">
              {tabs.map((tab) => (
                <span
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-base sm:text-lg w-1/2 py-3 ${
                    activeTab === tab.id
                      ? "bg-[#0B6EC9] text-white"
                      : "text-[#818487]"
                  } cursor-pointer hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 text-center font-bold
                    ${tab.id === "past" && "rounded-l-full"}
                    ${tab.id === "start" && "rounded-r-full"}
                  `}
                >
                  {tab.label}
                </span>
              ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh]">
              {activeTab === "start" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
                      <span className="text-[#2c5282] text-lg font-semibold mb-2">
                        Academic Self Assessment
                      </span>
                      <span className="text-[#4a5568] text-center">
                        Evaluate academic strengths, weaknesses, and goals.
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
                      <span className="text-[#2c5282] text-lg font-semibold mb-2">
                        Social-Emotional Well-being
                      </span>
                      <span className="text-[#4a5568] text-center">
                        Evaluate emotional state, social skills, and stress
                        coping.
                      </span>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
                      <span className="text-[#2c5282] text-lg font-semibold mb-2">
                        Career Exploration
                      </span>
                      <span className="text-[#4a5568] text-center">
                        Evaluate career interests for further exploration.
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startAppraisal}
                      className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white py-3 px-8 rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      Start Appraisal
                    </motion.button>
                  </div>
                </div>
              ) : (
                <RecordedAppraisal />
              )}
              {academicAssessment && (
                <QuestionModal
                  academicAssessment={academicAssessment}
                  socioEmotional={socioEmotional}
                  careerExploration={careerExploration}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Appraisal;
