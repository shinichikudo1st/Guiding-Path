import { useState } from "react";
import ReportResult from "../modals/reportResult";
import {
  FaChartBar,
  FaFileAlt,
  FaCalendar,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";

const GenerateReport = () => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [showReportResult, setShowReportResult] = useState(false);

  const handleReportSelection = (report) => {
    setSelectedReports((prev) =>
      prev.includes(report)
        ? prev.filter((r) => r !== report)
        : [...prev, report]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch("/api/generateReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedReports, startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await response.json();
      setReportData(data.reportData);
      setShowReportResult(true);
      console.log(data.reportData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseReportResult = () => {
    setShowReportResult(false);
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reportOptions.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportOptions.map((option) => option.id));
    }
  };

  const reportOptions = [
    { id: "appointment", label: "Appointment" },
    { id: "appraisal", label: "Appraisal" },
    { id: "referral", label: "Referral" },
    { id: "systemUsage", label: "System Usage" },
    { id: "resource", label: "Resource" },
    { id: "evaluationTrends", label: "Evaluation Trends" },
    { id: "eventRegistration", label: "Event Registration" },
    { id: "userManagement", label: "User Management" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Generate Report
              </h1>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-white text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#062341]">
                      Select Reports
                    </h2>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center p-3 rounded-xl border transition-all duration-300 ${
                      selectedReports.length === reportOptions.length
                        ? "border-[#0B6EC9] bg-[#0B6EC9]/5"
                        : "border-[#0B6EC9]/20 hover:border-[#0B6EC9]/40"
                    }`}
                  >
                    <input
                      id="selectAll"
                      type="checkbox"
                      checked={selectedReports.length === reportOptions.length}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-[#0B6EC9] border-[#0B6EC9] rounded focus:ring-[#0B6EC9]"
                    />
                    <label
                      htmlFor="selectAll"
                      className="ml-3 text-sm font-medium text-[#062341] cursor-pointer whitespace-nowrap"
                    >
                      Select All
                    </label>
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportOptions.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
                        selectedReports.includes(option.id)
                          ? "border-[#0B6EC9] bg-[#0B6EC9]/5"
                          : "border-[#0B6EC9]/20 hover:border-[#0B6EC9]/40"
                      }`}
                    >
                      <input
                        id={option.id}
                        type="checkbox"
                        checked={selectedReports.includes(option.id)}
                        onChange={() => handleReportSelection(option.id)}
                        className="w-5 h-5 text-[#0B6EC9] border-[#0B6EC9] rounded focus:ring-[#0B6EC9]"
                      />
                      <label
                        htmlFor={option.id}
                        className="ml-3 text-sm font-medium text-[#062341] cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center">
                    <FaCalendar className="text-white text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#062341]">
                    Date Range
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#062341]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 bg-white border border-[#0B6EC9]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#062341]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 bg-white border border-[#0B6EC9]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={
                    isLoading ||
                    selectedReports.length === 0 ||
                    !startDate ||
                    !endDate
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-semibold hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaChartLine />
                      Generate Report
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg"
        >
          {error}
        </motion.div>
      )}

      {showReportResult && (
        <ReportResult
          reportData={reportData}
          onClose={handleCloseReportResult}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </motion.div>
  );
};

export default GenerateReport;
