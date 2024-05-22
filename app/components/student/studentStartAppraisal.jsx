import { useEffect, useState } from "react";
import Question from "./question";

const StartAppraisal = ({ status }) => {
  const [appraisalQuestion, setAppraisalQuestion] = useState(null);

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

  console.log(academicQuestions);

  return (
    <div
      className={`absolute scrollbar-thin scrollbar-thumb-sky-700 scrollbar-track-sky-300 w-[55%] h-[83vh] bg-[#E6F0F9] right-[22.5%] bottom-[2%] 2xl:bottom-[5%] rounded-[20px] flex flex-col items-center 2xl:p-[50px] gap-5 overflow-auto lg:p-[20px]  ${
        status ? "visible" : "invisible"
      }`}
    >
      <div className="flex flex-col lg:gap-[60px]">
        <h3 className="text-center text-[#062341] font-bold text-[20pt] lg:mb-[-50px]">
          Academic Assessment
        </h3>
        {academicQuestions.academic.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </div>
      <button className=" bg-[#0B6EC9] lg:w-[200px] lg:h-[40px] lg:mt-[20px] rounded-[5px] font-bold hover:scale-110 hover:bg-[#6e9eca] duration-75">
        Next
      </button>
    </div>
  );
};

export default StartAppraisal;
