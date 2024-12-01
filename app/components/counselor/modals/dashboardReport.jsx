import React, { useEffect, useState } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  FaUserTie,
  FaChartBar,
  FaExclamationTriangle,
  FaClipboardList,
  FaInbox,
} from "react-icons/fa";
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

const CACHE_KEY = "dashboardData";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const DashboardReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check cache first
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > CACHE_DURATION;

          if (!isExpired) {
            setReportData(data);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data if cache is missing or expired
        const response = await fetch("/api/dashboardReport");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const data = await response.json();

        // Store in cache with timestamp
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        setReportData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardReportSkeleton />;
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
  const appraisalData = reportData.find((r) => r.name === "appraisal");
  const requestData = reportData.find((r) => r.name === "request");

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
          {!appointmentData?.appointmentByDate ? (
            <EmptyState
              icon={FaUserTie}
              message="No appointments recorded for this month"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0B6EC9]">
                    {appointmentData.appointmentByDate}
                  </p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">
                    {appointmentData.appointmentsBySelf}
                  </p>
                  <p className="text-sm text-gray-600">Self-Appointed</p>
                </div>
              </div>
              {appointmentData.appointmentByReason && (
                <div className="mt-4 h-48">
                  <Bar
                    data={getAppointmentChartData(
                      appointmentData.appointmentByReason
                    )}
                    options={chartOptions}
                  />
                </div>
              )}
            </>
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
          {!referralData?.referralByDate ? (
            <EmptyState
              icon={FaChartBar}
              message="No referrals recorded for this month"
            />
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-[#0B6EC9]">
                  {referralData.referralByDate}
                </p>
                <p className="text-sm text-gray-600">Total Referrals</p>
              </div>
              {referralData.referralByReason && (
                <div className="h-48">
                  <Pie
                    data={getReferralChartData(referralData.referralByReason)}
                    options={pieChartOptions}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Appraisal Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <FaClipboardList className="text-white text-xl mr-2" />
            <h3 className="text-white text-lg font-semibold">
              Monthly Appraisals
            </h3>
          </div>
        </div>
        <div className="p-4">
          {!appraisalData?.totalAppraisals ? (
            <EmptyState
              icon={FaClipboardList}
              message="No appraisals recorded for this month"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#0B6EC9]">
                  {appraisalData.totalAppraisals}
                </p>
                <p className="text-sm text-gray-600">Total Appraisals</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">
                  {appraisalData.averageScores?._avg?.score?.toFixed(1) || 0}
                </p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center col-span-2 mt-4 bg-blue-50 p-3 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {(
                    (appraisalData.totalAppraisals /
                      appraisalData.totalStudents) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-sm text-blue-600">Participation Rate</p>
                <p className="text-xs text-blue-500 mt-1">
                  {appraisalData.totalAppraisals} out of{" "}
                  {appraisalData.totalStudents} students
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <FaInbox className="text-white text-xl mr-2" />
            <h3 className="text-white text-lg font-semibold">
              Appointment Requests
            </h3>
          </div>
        </div>
        <div className="p-4">
          {!requestData?.totalRequests ? (
            <EmptyState
              icon={FaInbox}
              message="No requests recorded for this month"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#0B6EC9]">
                    {requestData.totalRequests}
                  </p>
                  <p className="text-sm text-gray-600">Total Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-600">
                    {requestData.pendingRequests}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
              {requestData.requestsByUrgency && (
                <div className="mt-4 h-48">
                  <Doughnut
                    data={getRequestUrgencyChartData(
                      requestData.requestsByUrgency
                    )}
                    options={doughnutChartOptions}
                  />
                </div>
              )}
            </>
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

const getRequestUrgencyChartData = (requestsByUrgency) => ({
  labels: requestsByUrgency.map((item) => item.urgency),
  datasets: [
    {
      data: requestsByUrgency.map((item) => item._count),
      backgroundColor: [
        "rgba(239, 68, 68, 0.6)", // red for urgent
        "rgba(234, 179, 8, 0.6)", // yellow for medium
        "rgba(34, 197, 94, 0.6)", // green for low
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

const doughnutChartOptions = {
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
      text: "Requests by Urgency",
    },
  },
};

const DashboardReportSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
    >
      {/* Appointments Summary Skeleton */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded mr-2 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </div>
          <div className="mt-4 h-48 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Referrals Summary Skeleton */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded mr-2 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="h-48 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Appraisal Summary Skeleton */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded mr-2 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Request Summary Skeleton */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white/20 rounded mr-2 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </div>
          <div className="mt-4 h-48 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-48 text-gray-500">
    <Icon className="text-4xl mb-3 text-gray-400" />
    <p className="text-sm text-center">{message}</p>
  </div>
);

export default DashboardReport;
