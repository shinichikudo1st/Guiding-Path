import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaChartBar,
  FaUserGraduate,
  FaExclamationCircle,
} from "react-icons/fa";

const StudentResponseDetail = ({ student, onBack }) => {
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

  const getOverallScore = () => {
    if (!student.categoryResponses?.length) return 0;
    return (
      student.categoryResponses.reduce((acc, cat) => acc + cat.score, 0) /
      student.categoryResponses.length
    );
  };

  if (!student.categoryResponses?.length) {
    return (
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
            No Responses Found
          </h3>
          <p className="text-gray-600">
            This student hasn't submitted any responses yet.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#0B6EC9]/5 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-[#062341]" />
          </button>
          <div className="flex items-center gap-3">
            <FaUserGraduate className="text-2xl text-[#0B6EC9]" />
            <div>
              <h2 className="text-xl font-semibold text-[#062341]">
                {student.student?.student?.name || "Student"}
              </h2>
              <p className="text-sm text-gray-500">
                Submitted on {formatDate(student.submittedAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaChartBar className="text-[#0B6EC9]" />
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
              getOverallScore()
            )} text-white`}
          >
            {getOverallScore().toFixed(2)}
          </span>
        </div>
      </div>

      {/* Category Responses */}
      <div className="space-y-6">
        {student.categoryResponses.map((categoryResponse, index) => (
          <motion.div
            key={categoryResponse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#062341]">
                {categoryResponse.category?.name || "Category"}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                  categoryResponse.score
                )} text-white`}
              >
                {categoryResponse.score.toFixed(2)}
              </span>
            </div>

            <div className="space-y-4">
              {categoryResponse.questionResponses?.map((qResponse) => (
                <div
                  key={qResponse.id}
                  className="border-l-2 border-[#0B6EC9]/20 pl-4"
                >
                  <p className="text-[#062341]">
                    {qResponse.question?.question || "Question"}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div
                          key={score}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            score === qResponse.response
                              ? "bg-[#0B6EC9] text-white"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {score}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentResponseDetail;
