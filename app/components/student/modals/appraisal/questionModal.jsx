import { useEffect, useRef, useState } from "react";
import ThankYouModal from "./thankYou";

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
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
        <div className="absolute text-[20pt] top-[1%] font-bold">{title}</div>
        <form
          ref={scrollableDiv}
          className="flex flex-col h-[80%] w-[80%] xl:mt-2 pl-[5%] pt-[5%] pb-[5%] overflow-auto gap-[10%] scrollbar-thin scrollbar-thumb-[#3B82F6] scrollbar-track-[#E5E7EB] scroll-smooth"
        >
          {question && question.length > 0 ? (
            question.map((questionText, index) => (
              <div
                key={index}
                className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md"
              >
                <p className="xl:text-[15pt] 2xl:text-[20pt] text-[#1E40AF] font-bold leading-tight mb-4">
                  {questionText}
                </p>
                <div className="flex xl:text-[10pt] 2xl:text-[14pt] text-[#374151] gap-[5%] justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <input
                        type="radio"
                        className="w-[24px] h-[24px] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer transition-all duration-200 ease-in-out"
                        name={`q${area}-${index}`}
                        value={value}
                        checked={responses[index] === value}
                        onChange={() => handleResponseChange(index, value)}
                      />
                      <label className="mt-3 text-center font-medium">
                        {value === 1
                          ? "Strongly Disagree"
                          : value === 5
                          ? "Strongly Agree"
                          : value === 2
                          ? "Disagree"
                          : value === 3
                          ? "Neutral"
                          : "Agree"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#4B5563] text-[18pt] font-semibold">
              Loading questions...
            </p>
          )}
        </form>
        {area < 3 ? (
          <button
            onClick={nextAppraisal}
            disabled={!isAllQuestionsAnswered}
            className="absolute right-[10%] bottom-[5%] w-[15%] h-[10%] px-6 py-3 min-w-[150px] text-[18px] text-center text-[#EAF1F9] font-semibold bg-[#265E99] border-2 border-[#265E99] rounded-[15px] shadow-md transition-all duration-300 active:scale-95 hover:bg-[#1a4a7c] hover:border-[#1a4a7c] focus:outline-none focus:ring-2 focus:ring-[#265E99] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <span className="ml-2">→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={submitAppraisal}
            disabled={submitting || !isAllQuestionsAnswered}
            className="absolute right-[10%] bottom-[5%] w-[15%] h-[10%] px-6 py-3 min-w-[150px] text-[18px] text-center text-[#EAF1F9] font-semibold bg-[#265E99] border-2 border-[#265E99] rounded-[15px] shadow-md transition-all duration-300 active:scale-95 hover:bg-[#1a4a7c] hover:border-[#1a4a7c] focus:outline-none focus:ring-2 focus:ring-[#265E99] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </>
  );
};

export default QuestionModal;
