import { useState, useEffect } from "react";
import { FaClipboardList, FaEye, FaCalendar } from "react-icons/fa";
import { motion } from "framer-motion";
import ViewCompleted from "./viewCompleted";

const CompletedAppraisal = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);

  useEffect(() => {
    fetchCompletedAppraisals();
  }, []);

  const fetchCompletedAppraisals = async () => {
    try {
      const response = await fetch("/api/appraisal/getCompleted");
      if (!response.ok) throw new Error("Failed to fetch completed appraisals");
      const data = await response.json();
      setAppraisals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = (appraisal) => {
    setSelectedAppraisal(appraisal);
  };

  const handleBack = () => {
    setSelectedAppraisal(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B6EC9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button
          onClick={fetchCompletedAppraisals}
          className="text-[#0B6EC9] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (selectedAppraisal) {
    return <ViewCompleted appraisal={selectedAppraisal} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      {appraisals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No completed appraisals yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Complete an appraisal to see it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {appraisals.map((appraisal) => (
            <motion.div
              key={appraisal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#062341]">
                    {appraisal.template.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {appraisal.template.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FaCalendar className="text-[#0B6EC9]" />
                    {formatDate(appraisal.submittedAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaClipboardList className="text-[#0B6EC9]" />
                    {appraisal.categoryResponses.length} Categories
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Average Score:{" "}
                    <span className="font-semibold text-[#0B6EC9]">
                      {(
                        appraisal.categoryResponses.reduce(
                          (acc, cat) => acc + cat.score,
                          0
                        ) / appraisal.categoryResponses.length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(appraisal)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#0B6EC9] hover:bg-[#0B6EC9]/10 rounded-lg transition-colors"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedAppraisal;
