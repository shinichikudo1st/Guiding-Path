import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FaUserTie, FaChartBar, FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        // Get first and last day of current month
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];

        const response = await fetch("/api/generateReport", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedReports: ["appointment", "referral"],
            startDate,
            endDate,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }

        const data = await response.json();
        setReportData(data.reportData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B6EC9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <FaExclamationTriangle className="text-red-500 mr-2" />
          <p className="text-red-600">Error loading report: {error}</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const appointmentData = reportData.find((r) => r.name === "appointment");
  const referralData = reportData.find((r) => r.name === "referral");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
    >
      {/* Appointments Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <FaUserTie className="text-white text-xl mr-2" />
            <h3 className="text-white text-lg font-semibold">
              Monthly Appointments
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-[#0B6EC9]">
                {appointmentData?.appointmentByDate || 0}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">
                {appointmentData?.appointmentsBySelf || 0}
              </p>
              <p className="text-sm text-gray-600">Self-Appointed</p>
            </div>
          </div>
          {appointmentData?.appointmentByReason && (
            <div className="mt-4 h-48">
              <Bar
                data={getAppointmentChartData(
                  appointmentData.appointmentByReason
                )}
                options={chartOptions}
              />
            </div>
          )}
        </div>
      </div>

      {/* Referrals Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <FaChartBar className="text-white text-xl mr-2" />
            <h3 className="text-white text-lg font-semibold">
              Monthly Referrals
            </h3>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-[#0B6EC9]">
              {referralData?.referralByDate || 0}
            </p>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </div>
          {referralData?.referralByReason && (
            <div className="h-48">
              <Pie
                data={getReferralChartData(referralData.referralByReason)}
                options={pieChartOptions}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const getAppointmentChartData = (appointmentByReason) => ({
  labels: appointmentByReason.map((item) => item.reason),
  datasets: [
    {
      label: "Appointments",
      data: appointmentByReason.map((item) => item._count.reason),
      backgroundColor: "rgba(11, 110, 201, 0.5)",
    },
  ],
});

const getReferralChartData = (referralByReason) => ({
  labels: referralByReason.map((item) => item.reason),
  datasets: [
    {
      data: referralByReason.map((item) => item._count.reason),
      backgroundColor: [
        "rgba(11, 110, 201, 0.6)",
        "rgba(34, 197, 94, 0.6)",
        "rgba(234, 179, 8, 0.6)",
        "rgba(239, 68, 68, 0.6)",
      ],
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Appointments by Reason",
    },
  },
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 12,
      },
    },
    title: {
      display: true,
      text: "Referrals by Reason",
    },
  },
};

export default DashboardReport;
