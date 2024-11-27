import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AppraisalProgressGraph = ({ appraisals, studentName }) => {
  const [timeFilter, setTimeFilter] = useState("all"); // all, weekly, monthly, yearly

  const filteredData = useMemo(() => {
    const now = new Date();
    const filtered = appraisals.filter((appraisal) => {
      const appraisalDate = new Date(appraisal.submittedAt);

      switch (timeFilter) {
        case "weekly":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return appraisalDate >= weekAgo;
        case "monthly":
          const monthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
          return appraisalDate >= monthAgo;
        case "yearly":
          const yearAgo = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate()
          );
          return appraisalDate >= yearAgo;
        default:
          return true;
      }
    });

    return filtered.sort(
      (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)
    );
  }, [appraisals, timeFilter]);

  const chartData = {
    labels: filteredData.map((a) =>
      new Date(a.submittedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Average Score",
        data: filteredData.map(
          (a) =>
            a.categoryResponses.reduce((acc, cr) => acc + cr.score, 0) /
            a.categoryResponses.length
        ),
        borderColor: "#0B6EC9",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#0B6EC9",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 1,
        max: 5,
        title: {
          display: true,
          text: "Score",
        },
      },
      x: {
        title: {
          display: true,
          text: "Submission Date",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `Submitted: ${new Date(
              filteredData[index].submittedAt
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`;
          },
        },
      },
    },
  };

  const exportAsImage = async () => {
    const graphElement = document.getElementById("progress-graph");
    if (graphElement) {
      const canvas = await html2canvas(graphElement);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${studentName.replace(
        /\s+/g,
        "-"
      )}-progress-tracking.png`;
      link.click();
    }
  };

  return (
    <div
      id="progress-graph"
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[#062341]">
              Progress Tracking
            </h3>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <button
            onClick={exportAsImage}
            className="flex items-center gap-2 px-4 py-2 bg-[#0B6EC9] text-white rounded-lg hover:bg-[#095396] transition-colors"
            title="Export as Image"
          >
            <FaDownload className="w-4 h-4" />
            <span>Export Graph</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeFilter("weekly")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === "weekly"
                ? "bg-[#0B6EC9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFilter("monthly")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === "monthly"
                ? "bg-[#0B6EC9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFilter("yearly")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === "yearly"
                ? "bg-[#0B6EC9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === "all"
                ? "bg-[#0B6EC9] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AppraisalProgressGraph;
