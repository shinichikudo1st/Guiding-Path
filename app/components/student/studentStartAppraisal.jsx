import { useEffect, useRef, useState } from "react";
import Question from "./question";

const StartAppraisal = ({ status, wellBeing, second, career, third }) => {
  const [appraisalQuestion, setAppraisalQuestion] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/question.json");
      const data = await response.json();
      setAppraisalQuestion(data);
    };
    fetchQuestions();
  }, []);

  if (!appraisalQuestion) return <div>Loading...</div>;

  const [academicQuestions, wellBeingQuestions, careerQuestions] =
    appraisalQuestion;

  const handleNextClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    second();
  };
  const handleNextClickThird = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    third();
  };

  return (
    <div
      ref={containerRef}
      className={`absolute w-[55%] h-[83vh] bg-[#E6F0F9] right-[22.5%] bottom-[2%] 2xl:bottom-[5%] rounded-[20px] flex flex-col items-center 2xl:p-[50px] gap-5 overflow-auto lg:p-[20px] ${
        status ? "visible" : "invisible"
      }`}
    >
      <div
        className={`flex flex-col lg:gap-[60px] ${
          status && !wellBeing && !career ? "block" : "hidden"
        }`}
      >
        <h3 className="text-center text-[#062341] font-bold text-[20pt] lg:mb-[-50px]">
          Academic Assessment
        </h3>
        {academicQuestions.academic.map((question) => (
          <Question key={question.id} question={question} />
        ))}
        <button
          className="lg:translate-x-[250px] lg:translate-y-[-20px] bg-[#0B6EC9] lg:w-[100px] lg:h-[30px] lg:mt-[20px] rounded-[5px] font-bold hover:scale-110 hover:bg-[#6e9eca] duration-75"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>

      <div
        className={`flex flex-col lg:gap-[60px] ${
          status && wellBeing && !career ? "block" : "hidden"
        }`}
      >
        <h3 className="text-center text-[#062341] font-bold text-[20pt] lg:mb-[-50px]">
          Social-Emotional Well-being
        </h3>
        {wellBeingQuestions.well_being.map((question) => (
          <Question key={question.id} question={question} />
        ))}
        <button
          className="lg:translate-x-[250px] lg:translate-y-[-20px] bg-[#0B6EC9] lg:w-[100px] lg:h-[30px] lg:mt-[20px] rounded-[5px] font-bold hover:scale-110 hover:bg-[#6e9eca] duration-75"
          onClick={handleNextClickThird}
        >
          Next
        </button>
      </div>

      {/* <div
        className={`flex flex-col lg:gap-[60px] lg:m-[20px]${
          status && !wellBeing && career ? "block" : "hidden"
        }`}
      >
        <h3 className="text-center text-[#062341] font-bold text-[20pt] lg:mb-[-50px]">
          Career Exploration
        </h3>
        {careerQuestions.career.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div> */}
    </div>
  );
};

export default StartAppraisal;
