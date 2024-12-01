import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FaSpinner, FaDownload, FaFileCsv, FaArrowUp } from "react-icons/fa";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GeneralAppraisalReport = () => {
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("week");
  const [selectedDate, setSelectedDate] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [timeFilter, selectedDate]);

  const fetchReportData = async () => {
    try {
      const params = new URLSearchParams({
        timeFilter,
        ...(selectedDate && { date: selectedDate }),
      });

      const response = await fetch(`/api/appraisal/getReport?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setReportData(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      const element = chartRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `appraisal-report-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    const distributionData = reportData.appraisalDistribution
      .map(
        (item) =>
          `${item.title},${item.responseCount},${item.averageScore.toFixed(
            2
          )},${new Date(item.createdAt).toLocaleDateString()}`
      )
      .join("\n");

    const csvContent = [
      "Appraisal Title,Number of Responses,Average Score,Created Date",
      distributionData,
      "",
      "Summary",
      `Total Appraisals,${reportData.totalAppraisals}`,
      `Total Students,${reportData.totalStudents}`,
      `Overall Average Score,${reportData.averageScore.toFixed(2)}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `appraisal-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[40vh]">
        <FaSpinner className="animate-spin text-3xl text-[#0B6EC9]" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#062341]">Appraisal Report</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <FaFileCsv className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B6EC9] text-white rounded-lg hover:bg-[#095396] transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <FaSpinner className="w-4 h-4 animate-spin" />
            ) : (
              <FaDownload className="w-4 h-4" />
            )}
            {exporting ? "Exporting..." : "Export Image"}
          </button>
        </div>
      </div>

      <div ref={chartRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Total Appraisals
            </h3>
            <p className="text-3xl font-bold text-[#0B6EC9]">
              {reportData.totalAppraisals}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Average Score
            </h3>
            <p className="text-3xl font-bold text-[#0B6EC9]">
              {reportData.averageScore.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-[#0B6EC9]">
              {reportData.totalStudents}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Score Trend
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  reportData.trendAnalysis.trend === "improving"
                    ? "text-green-500"
                    : reportData.trendAnalysis.trend === "declining"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {reportData.trendAnalysis.percentageChange.toFixed(1)}%
              </span>
              <FaArrowUp
                className={`${
                  reportData.trendAnalysis.trend === "improving"
                    ? "text-green-500 rotate-0"
                    : reportData.trendAnalysis.trend === "declining"
                    ? "text-red-500 rotate-180"
                    : "text-yellow-500 rotate-90"
                } transition-transform`}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">vs previous period</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Participation Rate
            </h3>
            <div className="text-2xl font-bold text-[#0B6EC9]">
              {(
                reportData.participationMetrics?.participationRate || 0
              ).toFixed(1)}
              %
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {reportData.participationMetrics.participated} of{" "}
              {reportData.participationMetrics.totalEligible} students
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold text-[#062341] mb-2">
              Critical Cases
            </h3>
            <div className="text-2xl font-bold text-red-500">
              {reportData.criticalMetrics.totalCritical}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {(reportData.criticalMetrics?.criticalRate || 0).toFixed(1)}% of
              total appraisals
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#062341]">
              Appraisal Distribution
            </h3>
            <div className="flex items-center gap-4">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#0B6EC9]/10 text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Month</option>
              </select>

              {timeFilter === "custom" && (
                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#0B6EC9]/10 text-sm"
                />
              )}
            </div>
          </div>
          <Bar
            data={{
              labels: reportData.appraisalDistribution.map(
                (item) => item.title
              ),
              datasets: [
                {
                  label: "Number of Responses",
                  data: reportData.appraisalDistribution.map(
                    (item) => item.responseCount
                  ),
                  backgroundColor: "#0B6EC9",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const appraisal =
                        reportData.appraisalDistribution[context.dataIndex];
                      return [
                        `Responses: ${appraisal.responseCount}`,
                        `Average Score: ${appraisal.averageScore.toFixed(2)}`,
                        `Created: ${new Date(
                          appraisal.createdAt
                        ).toLocaleDateString()}`,
                      ];
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Responses",
                  },
                },
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                  },
                },
              },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default GeneralAppraisalReport;
