import { FaArrowLeft, FaEdit } from "react-icons/fa";

const DetailView = ({ appraisal, onBack, onEdit }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header with back button - fixed at top */}
      <div className="flex items-center justify-between p-6 bg-white/50 border-b border-[#0B6EC9]/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#0B6EC9] hover:text-[#0B6EC9]/80"
        >
          <FaArrowLeft /> Back to List
        </button>
        <button
          onClick={() => onEdit(appraisal)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          <FaEdit /> Edit Template
        </button>
      </div>

      {/* Scrollable content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-8rem)] scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent">
        {/* Template Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-[#062341] mb-2">
            {appraisal.title}
          </h2>
          <p className="text-gray-600 mb-4">{appraisal.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>
              Department: {appraisal.forDepartment || "All Departments"}
            </span>
            <span>•</span>
            <span>
              Created: {new Date(appraisal.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Categories and Questions */}
        <div className="space-y-4">
          {appraisal.categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-[#062341] mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-4">{category.description}</p>

              {/* Questions */}
              <div className="space-y-3">
                <h4 className="font-medium text-[#062341]">Questions:</h4>
                {category.questions.map((question) => (
                  <div
                    key={question.id}
                    className="pl-4 py-2 border-l-2 border-[#0B6EC9]/20"
                  >
                    <p className="text-gray-700">{question.question}</p>
                  </div>
                ))}
              </div>

              {/* Evaluation Criteria */}
              {category.evaluationCriteria.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-[#062341]">
                    Evaluation Criteria:
                  </h4>
                  {category.evaluationCriteria.map((criteria) => (
                    <div
                      key={criteria.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-[#062341]">
                          {criteria.evaluation}
                        </span>
                        <span className="text-sm text-gray-500">
                          Score Range: {criteria.minScore} - {criteria.maxScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {criteria.description}
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        Suggestion: {criteria.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
