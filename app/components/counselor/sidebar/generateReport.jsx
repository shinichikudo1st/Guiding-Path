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
    <div className="generateReportContainer absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex flex-col px-[4%] pt-[3%] xl:gap-[2%] 2xl:gap-[5%]">
      <h1 className="xl:text-[20pt] 2xl:text-[30pt] text-[#062341] font-bold">
        Generate Report
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-[#F0F7FF] rounded-lg p-6 shadow-md">
          <h2 className="xl:text-[12pt] 2xl:text-[18pt] text-[#062341] font-semibold mb-4">
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
                  className="ml-2 xl:text-[10pt] 2xl:text-[14pt] font-medium text-[#565B60]"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F0F7FF] rounded-lg p-6 shadow-md">
          <h2 className="xl:text-[12pt] 2xl:text-[18pt] text-[#062341] font-semibold mb-4">
            Select report date range:
          </h2>
          <div className="flex justify-between">
            <div className="flex flex-col w-[45%]">
              <label
                htmlFor="startDate"
                className="xl:text-[10pt] 2xl:text-[14pt] font-medium text-[#565B60] mb-2"
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
                className="xl:text-[10pt] 2xl:text-[14pt] font-medium text-[#565B60] mb-2"
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
      {showReportResult && (
        <ReportResult
          reportData={reportData}
          onClose={handleCloseReportResult}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
};

export default GenerateReport;
