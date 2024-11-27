import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaChartBar,
  FaClipboardList,
  FaExclamationCircle,
  FaLightbulb,
} from "react-icons/fa";
import AppraisalProgressGraph from "./appraisalProgressGraph";

const StudentAppraisalDetail = ({ student, onBack }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5)
      return "bg-green-500/90 border-2 border-green-600 text-white drop-shadow-lg hover:bg-green-500";
    if (score >= 4.0)
      return "bg-lime-300/90 border-2 border-lime-400 text-gray-800 drop-shadow-lg hover:bg-lime-300";
    if (score >= 3.0)
      return "bg-yellow-500/90 border-2 border-yellow-600 text-gray-800 drop-shadow-lg hover:bg-yellow-500";
    if (score >= 2.0)
      return "bg-orange-500/90 border-2 border-orange-600 text-white drop-shadow-lg hover:bg-orange-500";
    return "bg-red-500/90 border-2 border-red-600 text-white drop-shadow-lg hover:bg-red-500";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getOverallEvaluation = (score) => {
    if (score >= 4.5)
      return {
        evaluation: "Excellent!",
        description:
          "Student demonstrates exceptional performance and consistent growth across all areas.",
        suggestion:
          "Consider providing mentoring opportunities and advanced challenges to maintain engagement.",
      };
    if (score >= 4.0)
      return {
        evaluation: "Very Good",
        description:
          "Student shows strong performance and steady improvement in most areas.",
        suggestion:
          "Focus on specific areas for refinement while maintaining current strengths.",
      };
    if (score >= 3.0)
      return {
        evaluation: "Satisfactory",
        description:
          "Student meets basic expectations with potential for improvement.",
        suggestion:
          "Identify key areas for development and create targeted improvement plans.",
      };
    if (score >= 2.0)
      return {
        evaluation: "Needs Improvement",
        description:
          "Student shows inconsistent performance with significant room for growth.",
        suggestion:
          "Regular counseling sessions and structured support recommended.",
      };
    return {
      evaluation: "Requires Attention",
      description: "Student needs immediate support and intervention.",
      suggestion:
        "Implement comprehensive support plan with regular progress monitoring.",
    };
  };

  const renderDevelopmentSection = () => {
    if (student.appraisals.length === 0) return null;

    const averageScore =
      student.appraisals.reduce(
        (acc, appraisal) =>
          acc +
          appraisal.categoryResponses.reduce((sum, cr) => sum + cr.score, 0) /
            appraisal.categoryResponses.length,
        0
      ) / student.appraisals.length;

    const evaluation = getOverallEvaluation(averageScore);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <AppraisalProgressGraph
          appraisals={student.appraisals}
          studentName={student.student.name}
        />

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
                  <FaLightbulb className="text-[#0B6EC9] text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#062341]">
                  Overall Assessment
                </h3>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(
                  averageScore
                )} transition-all duration-200 backdrop-blur-sm`}
              >
                {averageScore.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#0B6EC9]/5 to-transparent p-4 rounded-lg">
                <h4 className="font-semibold text-[#062341] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0B6EC9]" />
                  Current Status
                </h4>
                <div className={`text-lg font-medium mb-2 text-[#0B6EC9]`}>
                  {evaluation.evaluation}
                </div>
                <p className="text-gray-600 text-sm">
                  {evaluation.description}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#0B6EC9]/5 to-transparent p-4 rounded-lg">
                <h4 className="font-semibold text-[#062341] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0B6EC9]" />
                  Action Plan
                </h4>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <FaClipboardList className="text-[#0B6EC9]" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    {evaluation.suggestion}
                  </p>
                </div>
              </div>
            </div>

            {student.appraisals.length > 1 && (
              <div className="pt-4 mt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaChartBar className="text-[#0B6EC9]" />
                  <span>
                    Based on {student.appraisals.length} completed appraisals
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

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
        <div>
          <h2 className="text-2xl font-semibold text-[#062341]">
            {student.student.name}
          </h2>
          <p className="text-gray-600">{student.student.email}</p>
        </div>
      </div>

      {renderDevelopmentSection()}

      {/* Empty State or Appraisal List */}
      {student.appraisals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-[#0B6EC9]/10 rounded-full flex items-center justify-center mx-auto">
              <FaExclamationCircle className="text-3xl text-[#0B6EC9]" />
            </div>
            <h3 className="text-xl font-semibold text-[#062341]">
              No Appraisals Found
            </h3>
            <p className="text-gray-600">
              This student hasn't completed any appraisals yet. Check back later
              or encourage them to participate in available appraisals.
            </p>
            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-lg">
                <FaClipboardList />
                <span>Pending Appraisals Available</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {student.appraisals.map((appraisal) => (
            <motion.div
              key={appraisal.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-[#062341]">
                      {appraisal.template.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {appraisal.template.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted on {formatDate(appraisal.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChartBar className="text-[#0B6EC9]" />
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getScoreColor(
                        appraisal.categoryResponses.reduce(
                          (acc, cr) => acc + cr.score,
                          0
                        ) / appraisal.categoryResponses.length
                      )} transition-all duration-200 backdrop-blur-sm`}
                    >
                      {(
                        appraisal.categoryResponses.reduce(
                          (acc, cr) => acc + cr.score,
                          0
                        ) / appraisal.categoryResponses.length
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Category Responses */}
                <div className="space-y-4 mt-6">
                  {appraisal.categoryResponses.map((categoryResponse) => (
                    <div
                      key={categoryResponse.id}
                      className="border-l-2 border-[#0B6EC9]/20 pl-4"
                    >
                      <h4 className="font-medium text-[#062341]">
                        {categoryResponse.category.name}
                      </h4>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Score:</span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                            categoryResponse.score
                          )} transition-all duration-200 backdrop-blur-sm`}
                        >
                          {categoryResponse.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAppraisalDetail;
