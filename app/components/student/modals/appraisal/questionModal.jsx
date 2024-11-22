import { useEffect, useRef, useState } from "react";
import ThankYouModal from "./thankYou";
import { motion } from "framer-motion";
import { FaArrowRight, FaPaperPlane } from "react-icons/fa";

const QuestionModal = ({
  academicAssessment,
  socioEmotional,
  careerExploration,
}) => {
  const [area, setArea] = useState(1);
  const [question, setQuestion] = useState([]);
  const [title, setTitle] = useState("");
  const [thankyou, setThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [academicScore, setAcademicScore] = useState(0);
  const [socioEmotionalScore, setSocioEmotionalScore] = useState(0);
  const [careerScore, setCareerScore] = useState(0);

  const [responses, setResponses] = useState({});

  const scrollableDiv = useRef(null);

  const scrollBackTop = () => {
    if (scrollableDiv.current) {
      scrollableDiv.current.scrollTop = 0;
    }
  };

  const refresh = () => {
    setThankYou(false);
    window.location.reload();
  };

  const submitAppraisal = async (event) => {
    const academicFinalScore =
      area === 1
        ? Object.values(responses).reduce((acc, val) => acc + val, 0)
        : academicScore;
    const socioEmotionalFinalScore =
      area === 2
        ? Object.values(responses).reduce((acc, val) => acc + val, 0)
        : socioEmotionalScore;
    const careerFinalScore =
      area === 3
        ? Object.values(responses).reduce((acc, val) => acc + val, 0)
        : careerScore;

    const data = {
      academic: parseInt(academicFinalScore, 10),
      socioEmotional: parseInt(socioEmotionalFinalScore, 10),
      career: parseInt(careerFinalScore, 10),
    };

    console.log(data);

    setSubmitting(true);

    try {
      const response = await fetch("/api/createAppraisal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await fetch("/api/createEvaluationTrend", {
        method: "POST",
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      return console.error("Submission error", error);
    }

    setSubmitting(false);
    setThankYou(true);
  };

  const changeQuestion = () => {
    if (area === 1) {
      setTitle("Academic Self-Assessment");
      setQuestion(academicAssessment);
    } else if (area === 2) {
      setTitle("Socio-Emotional Well Being");
      setQuestion(socioEmotional);
    } else if (area === 3) {
      setTitle("Career Exploration");
      setQuestion(careerExploration);
    } else {
      setTitle("Academic Self-Assessment");
      setArea(1);
    }
  };

  const calculateScore = () => {
    const score = Object.values(responses).reduce((acc, val) => acc + val, 0);
    if (area === 1) {
      setAcademicScore(score);
    } else if (area === 2) {
      setSocioEmotionalScore(score);
    } else if (area === 3) {
      setCareerScore(score);
    }
  };

  const nextAppraisal = () => {
    scrollBackTop();
    calculateScore();
    setResponses({});
    if (area >= 3) {
      setArea(1);
    } else {
      setArea(area + 1);
    }
  };

  const handleResponseChange = (questionIndex, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: parseInt(value, 10),
    }));
  };

  useEffect(() => {
    changeQuestion();
  }, [area]);

  const isAllQuestionsAnswered =
    question.length > 0 && Object.keys(responses).length === question.length;

  return (
    <>
      {thankyou && <ThankYouModal refresh={refresh} />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex justify-center items-center"
        style={{ marginLeft: "-16rem", marginRight: "-16rem" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden z-50"
        >
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {title}
            </h2>
          </div>

          <form
            ref={scrollableDiv}
            className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#0B6EC9]/40"
          >
            {question && question.length > 0 ? (
              question.map((questionText, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/10 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <p className="text-lg font-semibold text-[#062341]">
                      {questionText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          key={value}
                          className="flex flex-col items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            className="w-5 h-5 text-[#0B6EC9] border-[#0B6EC9]/30 focus:ring-[#0B6EC9]/50 cursor-pointer transition-all duration-200"
                            name={`q${area}-${index}`}
                            value={value}
                            checked={responses[index] === value}
                            onChange={() => handleResponseChange(index, value)}
                          />
                          <span className="text-sm font-medium text-[#062341]/70 group-hover:text-[#0B6EC9] transition-colors duration-200">
                            {value === 1
                              ? "Strongly Disagree"
                              : value === 5
                              ? "Strongly Agree"
                              : value === 2
                              ? "Disagree"
                              : value === 3
                              ? "Neutral"
                              : "Agree"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-4 shadow-md opacity-50">
                  <FaPaperPlane className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#062341]">
                  Loading questions...
                </h3>
                <p className="text-sm text-[#062341]/70 mt-2">
                  Please wait while we prepare your assessment
                </p>
              </div>
            )}
          </form>

          <div className="p-6 bg-white/50 border-t border-[#0B6EC9]/10">
            <div className="flex justify-end">
              {area < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextAppraisal}
                  disabled={!isAllQuestionsAnswered}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FaArrowRight />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitAppraisal}
                  disabled={submitting || !isAllQuestionsAnswered}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span>Submitting</span>
                      <FaPaperPlane className="animate-pulse" />
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <FaPaperPlane />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default QuestionModal;
