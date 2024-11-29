import {
  FaArrowLeft,
  FaClipboardList,
  FaUserGraduate,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";

const DetailView = ({ appraisal, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header with back button - fixed at top */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300"
        >
          <FaArrowLeft /> Back to List
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
            <FaUsers className="text-white/80" />
            <span className="text-sm font-medium">
              {appraisal.studentResponses.length} Responses
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-8rem)] scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent">
        {/* Template Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-md border border-[#0B6EC9]/10"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-[#062341]">
                {appraisal.title}
              </h2>
              <p className="text-gray-600 max-w-2xl">{appraisal.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1.5 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-full">
                  {appraisal.forDepartment || "All Departments"}
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                  Created: {new Date(appraisal.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-2xl flex items-center justify-center shadow-lg">
              <FaClipboardList className="text-3xl text-white" />
            </div>
          </div>
        </motion.div>

        {/* Categories and Questions */}
        <div className="space-y-6">
          {appraisal.categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#0B6EC9]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#062341] mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <span className="px-3 py-1.5 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-full text-sm">
                  {category.questions.length} Questions
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + qIndex * 0.05 }}
                    className="pl-4 py-3 border-l-2 border-[#0B6EC9]/20 hover:border-[#0B6EC9] transition-all duration-300"
                  >
                    <p className="text-gray-700">{question.question}</p>
                  </motion.div>
                ))}
              </div>

              {/* Evaluation Criteria */}
              {category.evaluationCriteria.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-[#062341] flex items-center gap-2">
                    <FaChartBar className="text-[#0B6EC9]" />
                    Evaluation Criteria
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.evaluationCriteria.map((criteria) => (
                      <motion.div
                        key={criteria.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-[#062341]">
                            {criteria.evaluation}
                          </span>
                          <span className="text-sm px-2 py-1 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-full">
                            {criteria.minScore} - {criteria.maxScore}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {criteria.description}
                        </p>
                        <p className="text-sm text-[#0B6EC9]/80 italic">
                          {criteria.suggestion}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
