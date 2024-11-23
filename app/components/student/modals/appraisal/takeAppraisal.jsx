import { useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const LIKERT_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

const TakeAppraisal = ({ appraisal, onBack, fetchAvailableAppraisals }) => {
  const [responses, setResponses] = useState({});
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/appraisal/submitResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: appraisal.id,
          responses: Object.entries(responses).map(([questionId, value]) => ({
            questionId: parseInt(questionId),
            response: value,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit appraisal");

      // Return to available appraisals
      onBack();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      fetchAvailableAppraisals();
    }
  };

  const currentCategoryData = appraisal.categories[currentCategory];
  const isLastCategory = currentCategory === appraisal.categories.length - 1;
  const isCategoryComplete = currentCategoryData?.questions.every(
    (q) => responses[q.id] !== undefined
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-[#0B6EC9]" />
        </button>
        <h2 className="text-2xl font-semibold text-[#062341]">
          {appraisal.title}
        </h2>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm text-[#0B6EC9]">
            {currentCategory + 1} of {appraisal.categories.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-[#0B6EC9] rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentCategory + 1) / appraisal.categories.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Category Questions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#062341] mb-2">
            {currentCategoryData.name}
          </h3>
          <p className="text-gray-600">{currentCategoryData.description}</p>
        </div>

        <div className="space-y-8">
          {currentCategoryData.questions.map((question) => (
            <div key={question.id} className="space-y-4">
              <p className="text-[#062341] font-medium">{question.question}</p>

              {/* Likert Scale */}
              <div className="grid grid-cols-5 gap-2">
                {LIKERT_SCALE.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleResponse(question.id, value)}
                    onMouseEnter={() =>
                      setHoveredValue({ questionId: question.id, value })
                    }
                    onMouseLeave={() => setHoveredValue(null)}
                    className={`relative p-4 rounded-lg transition-all ${
                      responses[question.id] === value
                        ? "bg-[#0B6EC9] text-white border-2 border-[#0B6EC9]"
                        : hoveredValue?.questionId === question.id &&
                          hoveredValue?.value === value
                        ? "bg-[#0B6EC9]/10 border-2 border-[#0B6EC9]"
                        : "bg-white border-2 border-gray-200 hover:border-[#0B6EC9]/50"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <span
                        className={`text-lg font-semibold ${
                          responses[question.id] === value
                            ? "text-white"
                            : "text-[#062341]"
                        }`}
                      >
                        {value}
                      </span>
                      <p
                        className={`text-xs ${
                          responses[question.id] === value
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Response Indicator */}
              {responses[question.id] && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-[#0B6EC9]"
                >
                  Selected:{" "}
                  {
                    LIKERT_SCALE.find((s) => s.value === responses[question.id])
                      ?.label
                  }
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation/Submit */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentCategory((prev) => prev - 1)}
          disabled={currentCategory === 0}
          className={`px-6 py-2 rounded-lg ${
            currentCategory === 0
              ? "bg-gray-100 text-gray-400"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>

        {isLastCategory ? (
          <button
            onClick={handleSubmit}
            disabled={!isCategoryComplete || isSubmitting}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
              isCategoryComplete && !isSubmitting
                ? "bg-[#0B6EC9] text-white hover:bg-[#095396]"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Appraisal"}
            {!isSubmitting && <FaCheck />}
          </button>
        ) : (
          <button
            onClick={() => setCurrentCategory((prev) => prev + 1)}
            disabled={!isCategoryComplete}
            className={`px-6 py-2 rounded-lg ${
              isCategoryComplete
                ? "bg-[#0B6EC9] text-white hover:bg-[#095396]"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            Next
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default TakeAppraisal;
