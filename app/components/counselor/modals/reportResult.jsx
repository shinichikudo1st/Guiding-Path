import React, { useRef } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import {
  FaCalendarAlt,
  FaChartBar,
  FaUserTie,
  FaClipboardCheck,
  FaBook,
  FaChartLine,
  FaCalendar,
  FaUsers,
} from "react-icons/fa"; // Import icons
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const ReportResult = ({ reportData, onClose, startDate, endDate }) => {
  if (!reportData) return null;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const exportAsImage = async (reportRef, reportName) => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current);
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = `${reportName}_report_${startDate}_to_${endDate}.png`;
      link.href = image;
      link.click();
    }
  };

  return (
    <div className="imHere w-screen h-screen fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 translate-x-[-22.55%] translate-y-[-16%]">
      <div className="bg-white rounded-lg shadow-xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-[#0B6EC9] text-white p-6 rounded-t-lg shadow-md mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaChartBar className="text-3xl mr-4" />
              <h2 className="text-3xl font-bold">Report Results</h2>
            </div>
            <div className="flex items-center text-sm">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(startDate)}</span>
              <span className="mx-2">to</span>
              <span>{formatDate(endDate)}</span>
            </div>
          </div>
        </div>
        {reportData.map((report, index) => {
          switch (report.name) {
            case "appointment":
              const appointmentRef = useRef(null);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={appointmentRef}
                    className="bg-blue-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
                      <FaUserTie className="mr-3" />
                      Appointment Report
                    </h3>
                    {report.appointmentByDate === 0 ? (
                      <p className="text-lg text-gray-600">
                        No appointment data available for the selected date
                        range.
                      </p>
                    ) : (
                      // Existing content when data is available
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-blue-800 mb-2">
                            Total Appointments
                          </h4>
                          <p className="text-4xl font-bold text-blue-600">
                            {report.appointmentByDate}
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-green-800 mb-2">
                            Appointments by Type
                          </h4>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-green-600">Referral</p>
                              <p className="text-2xl font-bold text-green-700">
                                {report.appointmentsByReferral}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-green-600">
                                Self-Appointed
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                {report.appointmentsBySelf}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-8">
                      <h4 className="text-xl font-medium text-gray-700 mb-4">
                        Appointments by Reason
                      </h4>
                      <Bar
                        data={getChartData(report.appointmentByReason)}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                  {report.appointmentByDate > 0 && (
                    <button
                      onClick={() =>
                        exportAsImage(appointmentRef, "appointment")
                      }
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Export Appointment Report
                    </button>
                  )}
                </div>
              );
            case "referral":
              const referralRef = useRef(null);
              const topReasons = getTopReasons(report.referralByReason, 3);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={referralRef}
                    className="bg-green-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
                      <FaUserTie className="mr-3" />
                      Referral Report
                    </h3>
                    {report.referralByDate === 0 ? (
                      <p className="text-lg text-gray-600">
                        No referral data available for the selected date range.
                      </p>
                    ) : (
                      // Existing content when data is available
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-green-800 mb-2">
                            Total Referrals
                          </h4>
                          <p className="text-4xl font-bold text-green-600 mb-4">
                            {report.referralByDate}
                          </p>
                          <h5 className="text-lg font-medium text-green-700 mb-2">
                            Top Reasons:
                          </h5>
                          <ul className="list-disc list-inside">
                            {topReasons.map((reason, idx) => (
                              <li key={idx} className="text-sm text-green-600">
                                {reason.reason}: {reason.count}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-green-800 mb-2">
                            Referrals by Reason
                          </h4>
                          <Pie
                            data={getReferralReasonChartData(
                              report.referralByReason
                            )}
                            options={pieChartOptions}
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-8">
                      <h4 className="text-xl font-medium text-gray-700 mb-4">
                        Referrals by Teacher
                      </h4>
                      <Bar
                        data={getReferralTeacherChartData(
                          report.referralByTeacher
                        )}
                        options={barChartOptions}
                      />
                    </div>
                  </div>
                  {report.referralByDate > 0 && (
                    <button
                      onClick={() => exportAsImage(referralRef, "referral")}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Export Referral Report
                    </button>
                  )}
                </div>
              );
            case "appraisal":
              const appraisalRef = useRef(null);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={appraisalRef}
                    className="bg-purple-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center">
                      <FaClipboardCheck className="mr-3" />
                      Appraisal Report
                    </h3>
                    {report.appraisalByDate === 0 ? (
                      <p className="text-lg text-gray-600">
                        No appraisal data available for the selected date range.
                      </p>
                    ) : (
                      // Existing content when data is available
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-purple-800 mb-2">
                            Total Appraisals
                          </h4>
                          <p className="text-4xl font-bold text-purple-600">
                            {report.appraisalByDate}
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                          <h4 className="text-xl font-medium text-purple-800 mb-2">
                            Average Scores by Area
                          </h4>
                          <ul className="list-disc list-inside">
                            {report.appraisalAreaAverage.map((area, idx) => (
                              <li key={idx} className="text-sm text-purple-600">
                                {area.area_name}:{" "}
                                {area.average_score.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    <div className="mt-8">
                      <h4 className="text-xl font-medium text-gray-700 mb-4">
                        Appraisal Area Averages
                      </h4>
                      <Bar
                        data={getAppraisalChartData(
                          report.appraisalAreaAverage
                        )}
                        options={appraisalChartOptions}
                      />
                    </div>
                  </div>
                  {report.appraisalByDate > 0 && (
                    <button
                      onClick={() => exportAsImage(appraisalRef, "appraisal")}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Export Appraisal Report
                    </button>
                  )}
                </div>
              );
            case "resource":
              const resourceRef = useRef(null);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={resourceRef}
                    className="bg-yellow-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-yellow-800 mb-6 flex items-center">
                      <FaBook className="mr-3" />
                      Resource Report
                    </h3>
                    {report.totalResourceAccesses === 0 ? (
                      <p className="text-lg text-gray-600">
                        No resource data available for the selected date range.
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xl font-medium text-yellow-800 mb-2">
                              Total Resource Accesses
                            </h4>
                            <p className="text-4xl font-bold text-yellow-600">
                              {report.totalResourceAccesses}
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xl font-medium text-yellow-800 mb-2">
                              Resource Statistics
                            </h4>
                            <ul className="list-disc list-inside">
                              <li className="text-sm text-yellow-600">
                                Liked Resources: {report.likedResources}
                              </li>
                              <li className="text-sm text-yellow-600">
                                New Resources: {report.newResources}
                              </li>
                            </ul>
                          </div>
                        </div>
                        {report.popularResources.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-xl font-medium text-gray-700 mb-4">
                              Popular Resources
                            </h4>
                            <Bar
                              data={getPopularResourcesChartData(
                                report.popularResources
                              )}
                              options={popularResourcesChartOptions}
                            />
                          </div>
                        )}
                        {report.resourcesByCategory.length > 0 && (
                          <div className="mt-8">
                            <h4 className="text-xl font-medium text-gray-700 mb-4">
                              Resources by Category
                            </h4>
                            <div className="h-64">
                              <Pie
                                data={getResourcesByCategoryChartData(
                                  report.resourcesByCategory
                                )}
                                options={resourcesByCategoryChartOptions}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {report.totalResourceAccesses > 0 && (
                    <button
                      onClick={() => exportAsImage(resourceRef, "resource")}
                      className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Export Resource Report
                    </button>
                  )}
                </div>
              );
            case "evaluationTrends":
              const evaluationTrendsRef = useRef(null);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={evaluationTrendsRef}
                    className="bg-indigo-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center">
                      <FaChartLine className="mr-3" />
                      Evaluation Trends Report
                    </h3>
                    {report.trends.length === 0 ? (
                      <p className="text-lg text-gray-600">
                        No evaluation trends data available for the selected
                        date range.
                      </p>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xl font-medium text-indigo-800 mb-4">
                              Overall Averages
                            </h4>
                            <ul className="list-disc list-inside">
                              <li className="text-sm text-indigo-600">
                                Academic:{" "}
                                {report.averages.academic.score.toFixed(2)} (
                                {report.averages.academic.evaluation})
                              </li>
                              <li className="text-sm text-indigo-600">
                                Socio-Emotional:{" "}
                                {report.averages.socioEmotional.score.toFixed(
                                  2
                                )}{" "}
                                ({report.averages.socioEmotional.evaluation})
                              </li>
                              <li className="text-sm text-indigo-600">
                                Career Exploration:{" "}
                                {report.averages.careerExploration.score.toFixed(
                                  2
                                )}{" "}
                                ({report.averages.careerExploration.evaluation})
                              </li>
                              <li className="text-sm text-indigo-600">
                                Overall Average:{" "}
                                {report.averages.overallAverage.toFixed(2)}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-8">
                          <h4 className="text-xl font-medium text-gray-700 mb-4">
                            Evaluation Trends Over Time
                          </h4>
                          <Line
                            data={getEvaluationTrendsChartData(report.trends)}
                            options={evaluationTrendsChartOptions}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {report.trends.length > 0 && (
                    <button
                      onClick={() =>
                        exportAsImage(evaluationTrendsRef, "evaluation_trends")
                      }
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Export Evaluation Trends Report
                    </button>
                  )}
                </div>
              );
            case "eventRegistration":
              const eventRegistrationRef = useRef(null);
              return (
                <div
                  key={index}
                  className="mb-12 pb-8 border-b-2 border-gray-200"
                >
                  <div
                    ref={eventRegistrationRef}
                    className="bg-teal-50 p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-2xl font-semibold text-teal-800 mb-6 flex items-center">
                      <FaCalendar className="mr-3" />
                      Event Registration Report
                    </h3>
                    {report.totalEvents === 0 ? (
                      <p className="text-lg text-gray-600">
                        No event registration data available for the selected
                        date range.
                      </p>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xl font-medium text-teal-800 mb-2">
                              Total Events
                            </h4>
                            <p className="text-4xl font-bold text-teal-600">
                              {report.totalEvents}
                            </p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow">
                            <h4 className="text-xl font-medium text-teal-800 mb-2">
                              Total Registrations
                            </h4>
                            <p className="text-4xl font-bold text-teal-600">
                              {report.totalRegistrations}
                            </p>
                          </div>
                        </div>
                        {report.popularEvents.length > 0 && (
                          <div>
                            <h4 className="text-xl font-medium text-gray-700 mb-4">
                              Popular Events
                            </h4>
                            <div className="h-64">
                              <Bar
                                data={getPopularEventsChartData(
                                  report.popularEvents
                                )}
                                options={popularEventsChartOptions}
                              />
                            </div>
                          </div>
                        )}
                        {report.upcomingEvents.length > 0 && (
                          <div>
                            <h4 className="text-xl font-medium text-gray-700 mb-4">
                              Upcoming Events
                            </h4>
                            <div className="bg-white rounded-lg shadow-md p-4 max-h-64 overflow-y-auto">
                              <ul className="space-y-4">
                                {report.upcomingEvents.map((event, idx) => (
                                  <li
                                    key={idx}
                                    className="border-b border-gray-200 pb-2 last:border-b-0"
                                  >
                                    <h5 className="font-semibold text-teal-700">
                                      {event.title}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      Date:{" "}
                                      {new Date(
                                        event.date_time
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Location: {event.location}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Registrations: {event.registrations}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {report.totalEvents > 0 && (
                    <button
                      onClick={() =>
                        exportAsImage(
                          eventRegistrationRef,
                          "event_registration"
                        )
                      }
                      className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      Export Event Registration Report
                    </button>
                  )}
                </div>
              );
            // Add more cases here for other report types
            default:
              return null;
          }
        })}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const getChartData = (appointmentByReason) => {
  const labels = appointmentByReason.map((item) => item.reason);
  const data = appointmentByReason.map((item) => item._count.reason);

  return {
    labels,
    datasets: [
      {
        label: "Number of Appointments",
        data,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Appointments by Reason",
    },
  },
};

const getReferralReasonChartData = (referralByReason) => {
  const labels = referralByReason.map((item) => item.reason);
  const data = referralByReason.map((item) => item._count.reason);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  };
};

const getReferralTeacherChartData = (referralByTeacher) => {
  const labels = referralByTeacher.map((item) => `Teacher ${item.teacher_id}`);
  const data = referralByTeacher.map((item) => item._count.teacher_id);

  return {
    labels,
    datasets: [
      {
        label: "Number of Referrals",
        data,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
};

const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Referrals by Reason",
    },
  },
};

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Referrals by Teacher",
    },
  },
};

// Add this function at the end of the file
const getTopReasons = (referralByReason, count) => {
  return referralByReason
    .sort((a, b) => b._count.reason - a._count.reason)
    .slice(0, count)
    .map((item) => ({ reason: item.reason, count: item._count.reason }));
};

const getAppraisalChartData = (appraisalAreaAverage) => {
  const labels = appraisalAreaAverage.map((item) => item.area_name);
  const data = appraisalAreaAverage.map((item) => item.average_score);

  return {
    labels,
    datasets: [
      {
        label: "Average Score",
        data,
        backgroundColor: "rgba(128, 0, 128, 0.5)",
      },
    ],
  };
};

const appraisalChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Appraisal Area Averages",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5, // Assuming the maximum score is 5
    },
  },
};

// Add these new functions at the end of the file
const getPopularResourcesChartData = (popularResources) => {
  const labels = popularResources.map((item) => `Resource ${item.resource_id}`);
  const data = popularResources.map((item) => item._count.resource_id);

  return {
    labels,
    datasets: [
      {
        label: "Access Count",
        data,
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
    ],
  };
};

const popularResourcesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Top 10 Popular Resources",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const getResourcesByCategoryChartData = (resourcesByCategory) => {
  const labels = resourcesByCategory.map((item) => item.category);
  const data = resourcesByCategory.map((item) => item._count.category);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };
};

const resourcesByCategoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Resources by Category",
    },
  },
};

const getEvaluationTrendsChartData = (trends) => {
  const labels = trends.map((trend) => trend.date.toLocaleDateString());
  const datasets = [
    {
      label: "Academic",
      data: trends.map((trend) => trend.academic.score),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      label: "Socio-Emotional",
      data: trends.map((trend) => trend.socioEmotional.score),
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
    {
      label: "Career Exploration",
      data: trends.map((trend) => trend.careerExploration.score),
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
    },
    {
      label: "Overall Average",
      data: trends.map((trend) => trend.overallAverage),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
    },
  ];

  return { labels, datasets };
};

const evaluationTrendsChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Evaluation Trends Over Time",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
    },
  },
};

const getPopularEventsChartData = (popularEvents) => {
  const labels = popularEvents.map((event) => event.title);
  const data = popularEvents.map((event) => event.registrations);

  return {
    labels,
    datasets: [
      {
        label: "Registrations",
        data,
        backgroundColor: "rgba(20, 184, 166, 0.5)",
      },
    ],
  };
};

const popularEventsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Popular Events by Registrations",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export default ReportResult;
