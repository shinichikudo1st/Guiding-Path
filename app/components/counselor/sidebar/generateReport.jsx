import { useState } from "react";
import ReportResult from "../modals/reportResult";

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
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseReportResult = () => {
    setShowReportResult(false);
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
    { id: "resourcePopularity", label: "Resource Popularity" },
  ];

  return (
    <div className="generateReportContainer absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col px-[4%] pt-[3%] gap-[5%]">
      <h1 className="text-[30pt] text-[#062341] font-bold">Generate Report</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-[#F0F7FF] rounded-lg p-6 shadow-md">
          <h2 className="text-[18pt] text-[#062341] font-semibold mb-4">
            Select related reports to generate:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {reportOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  id={option.id}
                  type="checkbox"
                  checked={selectedReports.includes(option.id)}
                  onChange={() => handleReportSelection(option.id)}
                  className="w-5 h-5 text-[#0B6EC9] bg-[#dbe9f6] border-[#0B6EC9] rounded focus:ring-[#0B6EC9]"
                />
                <label
                  htmlFor={option.id}
                  className="ml-2 text-[14pt] font-medium text-[#565B60]"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F0F7FF] rounded-lg p-6 shadow-md">
          <h2 className="text-[18pt] text-[#062341] font-semibold mb-4">
            Select report date range:
          </h2>
          <div className="flex justify-between">
            <div className="flex flex-col w-[45%]">
              <label
                htmlFor="startDate"
                className="text-[14pt] font-medium text-[#565B60] mb-2"
              >
                Start Date:
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#dbe9f6] text-[#565B60] border border-[#0B6EC9] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]"
              />
            </div>
            <div className="flex flex-col w-[45%]">
              <label
                htmlFor="endDate"
                className="text-[14pt] font-medium text-[#565B60] mb-2"
              >
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#dbe9f6] text-[#565B60] border border-[#0B6EC9] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={
            isLoading || selectedReports.length === 0 || !startDate || !endDate
          }
          className="self-end w-[30%] py-3 rounded-[10px] font-semibold text-[#E6F0F9] bg-[#062341] hover:bg-[#0B6EC9] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-4">Error: {error}</div>}
      {reportData && (
        <div className="mt-8">
          <h2 className="text-[24pt] text-[#062341] font-bold mb-4">
            Generated Report
          </h2>
          <pre className="bg-white p-4 rounded-lg overflow-auto max-h-[400px]">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
      {showReportResult && (
        <ReportResult
          reportData={reportData}
          onClose={handleCloseReportResult}
        />
      )}
    </div>
  );
};

export default GenerateReport;
