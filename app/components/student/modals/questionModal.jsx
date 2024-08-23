import { useEffect, useState } from "react";

const QuestionModal = ({
  academicAssessment,
  socioEmotional,
  careerExploration,
}) => {
  const [area, setArea] = useState(1);
  const [question, setQuestion] = useState([]);
  const [title, setTitle] = useState("");

  const submitAppraisal = () => {};

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

  const nextAppraisal = () => {
    if (area > 3) {
      setArea(1);
    }

    setArea(area + 1);
  };

  useEffect(() => {
    changeQuestion();
  }, [area]);

  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
        <div className="absolute text-[20pt] top-[1%] font-bold">{title}</div>
        <form
          onSubmit={submitAppraisal}
          className="flex flex-col h-[80%] w-[80%] pl-[5%] pt-[5%] pb-[5%] overflow-auto gap-[10%] scrollbar-thin scrollbar-thumb-[#1A5590] scrollbar-track-[#98A9BA]"
        >
          {question && question.length > 0 ? (
            question.map((question, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p className="text-[18pt] text-[#1A5590] font-bold">
                  {question}
                </p>
                <div className="flex text-[10pt] text-[#062341] gap-[5%] justify-center font-semibold">
                  <div className="flex flex-col items-center">
                    <input
                      type="radio"
                      className="w-[25px] h-[25px]"
                      name={`q${index}`}
                      value="1"
                    />
                    <label>Strongly Disagree</label>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="radio"
                      className="w-[25px] h-[25px]"
                      name={`q${index}`}
                      value="2"
                    />
                    <label>Disagree</label>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="radio"
                      className="w-[25px] h-[25px]"
                      name={`q${index}`}
                      value="3"
                    />
                    <label>Neutral</label>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="radio"
                      className="w-[25px] h-[25px]"
                      name={`q${index}`}
                      value="4"
                    />
                    <label>Agree</label>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="radio"
                      className="w-[25px] h-[25px]"
                      name={`q${index}`}
                      value="5"
                    />
                    <label>Strongly Agree</label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Loading questions...</p> // Fallback for when careerAssessment is null or empty
          )}
        </form>
        <button
          onClick={nextAppraisal}
          className="absolute right-[10%] bottom-[5%] w-[10%] h-[8%] px-6 py-2 min-w-[120px] text-center text-[#EAF1F9] font-medium bg-[#265E99] border border-[#265E99] rounded-[10px] active:text-[#265E99] hover:bg-transparent hover:text-[#265E99] focus:outline-none focus:ring"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default QuestionModal;
