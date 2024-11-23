import { useState, useEffect } from "react";
import { FaArrowLeft, FaUserGraduate } from "react-icons/fa";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const ViewResponse = ({ appraisal, onBack }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setTotalPages(Math.ceil(appraisal.studentResponses.length / itemsPerPage));
  }, [appraisal.studentResponses]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appraisal.studentResponses.slice(startIndex, endIndex);
  };

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

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#0B6EC9]/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#0B6EC9]/5 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-[#062341]" />
          </button>
          <h2 className="text-lg font-semibold text-[#062341]">
            Student Responses
          </h2>
        </div>
        <p className="text-sm text-gray-500">{appraisal.title}</p>
      </div>

      <div className="flex-grow p-4 overflow-auto">
        {!selectedStudent ? (
          <motion.div
            className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {getCurrentPageItems().map((response, index) => (
              <motion.div
                key={response.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-[#0B6EC9]/30 cursor-pointer"
                onClick={() => setSelectedStudent(response)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUserGraduate className="text-xl text-[#0B6EC9]" />
                    <div>
                      <h3 className="font-medium text-[#062341] line-clamp-1">
                        {response.student.student.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(response.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                      response.categoryResponses.reduce(
                        (acc, cat) => acc + cat.score,
                        0
                      ) / response.categoryResponses.length
                    )} text-white`}
                  >
                    {(
                      response.categoryResponses.reduce(
                        (acc, cat) => acc + cat.score,
                        0
                      ) / response.categoryResponses.length
                    ).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <StudentResponseDetail
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
          />
        )}
      </div>

      {/* Pagination */}
      {!selectedStudent && appraisal.studentResponses.length > 0 && (
        <div className="bg-white border-t border-[#0B6EC9]/10 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#062341]/70">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
              >
                <IoChevronBackOutline className="w-4 h-4 text-[#062341]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
              >
                <IoChevronForwardOutline className="w-4 h-4 text-[#062341]" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResponse;
