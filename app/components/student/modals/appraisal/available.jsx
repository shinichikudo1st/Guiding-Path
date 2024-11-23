import { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaChevronRight,
  FaUserTie,
  FaBuilding,
} from "react-icons/fa";
import TakeAppraisal from "./takeAppraisal.jsx";

const AvailableAppraisal = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);

  useEffect(() => {
    fetchAvailableAppraisals();
  }, []);

  const fetchAvailableAppraisals = async () => {
    try {
      const response = await fetch("/api/appraisal/getAvailable");
      if (!response.ok) throw new Error("Failed to fetch appraisals");
      const data = await response.json();
      setAppraisals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B6EC9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        Error: {error}
      </div>
    );
  }

  if (selectedAppraisal) {
    return (
      <TakeAppraisal
        fetchAvailableAppraisals={fetchAvailableAppraisals}
        appraisal={selectedAppraisal}
        onBack={() => setSelectedAppraisal(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {appraisals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">
            No available appraisals found.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later for new appraisals.
          </p>
        </div>
      ) : (
        appraisals.map((appraisal) => (
          <div
            key={appraisal.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-3 flex-grow">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-[#062341] group-hover:text-[#0B6EC9] transition-colors">
                    {appraisal.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {appraisal.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FaClipboardList className="text-[#0B6EC9]" />
                    {appraisal.categories.length} Categories
                  </span>
                  <span className="flex items-center gap-2">
                    <FaUserTie className="text-[#0B6EC9]" />
                    {appraisal.counselor.counselor.name}
                  </span>
                  {appraisal.forDepartment && (
                    <span className="flex items-center gap-2">
                      <FaBuilding className="text-[#0B6EC9]" />
                      {appraisal.forDepartment || "All Departments"}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedAppraisal(appraisal)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0B6EC9] text-white rounded-lg hover:bg-[#095396] transition-colors font-medium group-hover:shadow-lg"
              >
                Take Appraisal{" "}
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AvailableAppraisal;
