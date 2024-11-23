import {
  FaArrowLeft,
  FaClipboardList,
  FaUserTie,
  FaLightbulb,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ViewCompleted = ({ appraisal, onBack }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 4.0) return "bg-lime-300";
    if (score >= 3.0) return "bg-yellow-500";
    if (score >= 2.0) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEvaluationForScore = (score, evaluationCriteria) => {
    return evaluationCriteria.find(
      (criteria) => score >= criteria.minScore && score <= criteria.maxScore
    );
  };

  const getOverallEvaluation = (score) => {
    if (score >= 4.5)
      return {
        evaluation: "Outstanding Performance",
        description:
          "Demonstrates exceptional overall performance across all categories.",
        suggestion:
          "Consider taking on leadership roles and mentoring opportunities to further develop skills.",
      };
    if (score >= 4.0)
      return {
        evaluation: "Very Good Performance",
        description:
          "Shows strong performance and consistent achievement in most areas.",
        suggestion:
          "Focus on specific areas for improvement while maintaining current strengths.",
      };
    if (score >= 3.0)
      return {
        evaluation: "Satisfactory Performance",
        description:
          "Meets basic expectations with room for improvement in some areas.",
        suggestion:
          "Identify key areas for development and create specific action plans.",
      };
    if (score >= 2.0)
      return {
        evaluation: "Needs Improvement",
        description: "Performance is below expectations in several areas.",
        suggestion:
          "Work closely with counselors to develop improvement strategies and seek additional support.",
      };
    return {
      evaluation: "Significant Concerns",
      description: "Performance is significantly below expectations.",
      suggestion:
        "Immediate intervention and support required. Schedule regular counseling sessions.",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0B6EC9]"
        >
          <FaArrowLeft /> Back to Completed Appraisals
        </button>
      </div>

      {/* Appraisal Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#062341]">
              {appraisal.template.title}
            </h2>
            <p className="text-gray-600 mt-2">
              {appraisal.template.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FaUserTie className="text-[#0B6EC9]" />
              Counselor: {appraisal.template.counselor.counselor.name}
            </span>
            <span className="flex items-center gap-2">
              <FaClipboardList className="text-[#0B6EC9]" />
              Submitted on: {formatDate(appraisal.submittedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Categories and Responses */}
      <div className="space-y-6">
        {appraisal.categoryResponses.map((categoryResponse) => {
          const categoryEvaluation = getEvaluationForScore(
            categoryResponse.score,
            categoryResponse.category.evaluationCriteria || []
          );

          return (
            <div
              key={categoryResponse.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-[#062341]">
                      {categoryResponse.category.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {categoryResponse.category.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Score:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                        categoryResponse.score
                      )} text-white`}
                    >
                      {categoryResponse.score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Question Responses */}
                <div className="space-y-4 mt-6">
                  {categoryResponse.questionResponses.map((qResponse) => (
                    <div
                      key={qResponse.id}
                      className="pl-4 py-3 border-l-2 border-[#0B6EC9]/20"
                    >
                      <p className="text-[#062341] font-medium">
                        {qResponse.question.question}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Response:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            qResponse.response
                          )} text-white`}
                        >
                          {qResponse.response}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Evaluation */}
                {categoryResponse.category.evaluationCriteria && (
                  <div className="mt-6 border-l-4 border-[#0B6EC9] bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-[#0B6EC9]/10 rounded-full">
                        <FaLightbulb className="text-[#0B6EC9]" />
                        <span className="font-medium text-[#062341]">
                          Category Evaluation
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Score Range:{" "}
                        {
                          getEvaluationForScore(
                            categoryResponse.score,
                            categoryResponse.category.evaluationCriteria
                          )?.minScore
                        }{" "}
                        -{" "}
                        {
                          getEvaluationForScore(
                            categoryResponse.score,
                            categoryResponse.category.evaluationCriteria
                          )?.maxScore
                        }
                      </span>
                    </div>
                    <div className="pl-4">
                      <h4 className="font-medium text-[#062341] mb-2">
                        {
                          getEvaluationForScore(
                            categoryResponse.score,
                            categoryResponse.category.evaluationCriteria
                          )?.evaluation
                        }
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {
                          getEvaluationForScore(
                            categoryResponse.score,
                            categoryResponse.category.evaluationCriteria
                          )?.description
                        }
                      </p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-[#0B6EC9]">
                          Suggestion:
                        </span>
                        <p className="text-sm text-gray-600">
                          {
                            getEvaluationForScore(
                              categoryResponse.score,
                              categoryResponse.category.evaluationCriteria
                            )?.suggestion
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Score and Evaluation */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-[#062341]">
              Overall Performance
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Final Score:</span>
              <span
                className={`px-4 py-2 rounded-full text-lg font-medium ${getScoreColor(
                  appraisal.categoryResponses.reduce(
                    (acc, cat) => acc + cat.score,
                    0
                  ) / appraisal.categoryResponses.length
                )} text-white`}
              >
                {(
                  appraisal.categoryResponses.reduce(
                    (acc, cat) => acc + cat.score,
                    0
                  ) / appraisal.categoryResponses.length
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Overall Evaluation */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-l-4 border-gray-400 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                <FaLightbulb className="text-gray-600" />
                <span className="font-medium text-gray-700">
                  Overall Assessment
                </span>
              </div>
            </div>
            <div className="pl-4">
              <h4 className="font-medium text-gray-700 mb-2">
                {
                  getOverallEvaluation(
                    appraisal.categoryResponses.reduce(
                      (acc, cat) => acc + cat.score,
                      0
                    ) / appraisal.categoryResponses.length
                  ).evaluation
                }
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {
                  getOverallEvaluation(
                    appraisal.categoryResponses.reduce(
                      (acc, cat) => acc + cat.score,
                      0
                    ) / appraisal.categoryResponses.length
                  ).description
                }
              </p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  Suggestion:
                </span>
                <p className="text-sm text-gray-600">
                  {
                    getOverallEvaluation(
                      appraisal.categoryResponses.reduce(
                        (acc, cat) => acc + cat.score,
                        0
                      ) / appraisal.categoryResponses.length
                    ).suggestion
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewCompleted;
