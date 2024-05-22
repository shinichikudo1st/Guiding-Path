import React, { useState } from "react";

const Question = ({ question, onAnswerChange }) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setAnswer(event.target.value);

    if (event.target.value < 1 || event.target.value > 5) {
      setError("Please select a valid option.");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-col lg:gap-5">
      <p className="text-[#1A5590] text-[13pt] font-semibold ">
        {question.text}
      </p>
      <div className="flex gap-2 text-[10pt] text-[#062341]">
        {question.options.map((option, index) => (
          <label key={index} className="flex items-center lg:gap-3">
            <input
              type="radio"
              name={question.id}
              value={index + 1}
              checked={answer === index + 1}
              onChange={handleInputChange}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500 "
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Question;
