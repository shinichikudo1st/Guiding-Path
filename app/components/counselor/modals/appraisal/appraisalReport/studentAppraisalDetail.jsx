import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaChartBar,
  FaClipboardList,
  FaExclamationCircle,
} from "react-icons/fa";

const StudentAppraisalDetail = ({ student, onBack }) => {
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
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                        appraisal.categoryResponses.reduce(
                          (acc, cr) => acc + cr.score,
                          0
                        ) / appraisal.categoryResponses.length
                      )} text-white`}
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
                          className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            categoryResponse.score
                          )} text-white`}
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
