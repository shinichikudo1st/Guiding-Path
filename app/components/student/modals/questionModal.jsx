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

  return (
    <>
      {thankyou && <ThankYouModal refresh={refresh} />}
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
        <div className="absolute text-[20pt] top-[1%] font-bold">{title}</div>
        <form
          ref={scrollableDiv}
          className="flex flex-col h-[80%] w-[80%] pl-[5%] pt-[5%] pb-[5%] overflow-auto gap-[10%] scrollbar-thin scrollbar-thumb-[#1A5590] scrollbar-track-[#98A9BA] scroll-smooth"
        >
          {question && question.length > 0 ? (
            question.map((questionText, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p className="text-[18pt] text-[#1A5590] font-bold">
                  {questionText}
                </p>
                <div className="flex text-[10pt] text-[#062341] gap-[5%] justify-center font-semibold">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <input
                        type="radio"
                        className="w-[25px] h-[25px]"
                        name={`q${area}-${index}`}
                        value={value}
                        checked={responses[index] === value}
                        onChange={() => handleResponseChange(index, value)}
                      />
                      <label>
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
            <p>Loading questions...</p>
          )}
        </form>
        {area < 3 ? (
          <button
            onClick={nextAppraisal}
            className="absolute right-[10%] bottom-[5%] w-[10%] h-[8%] px-6 py-2 min-w-[120px] text-center text-[#EAF1F9] font-medium bg-[#265E99] border border-[#265E99] rounded-[10px] active:text-[#265E99] hover:bg-transparent hover:text-[#265E99] focus:outline-none focus:ring"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={submitAppraisal}
            className="absolute right-[10%] bottom-[5%] w-[10%] h-[8%] px-6 py-2 min-w-[120px] text-center text-[#EAF1F9] font-medium bg-[#265E99] border border-[#265E99] rounded-[10px] active:text-[#265E99] hover:bg-transparent hover:text-[#265E99] focus:outline-none focus:ring"
          >
            Submit
          </button>
        )}
      </div>
    </>
  );
};

export default QuestionModal;
