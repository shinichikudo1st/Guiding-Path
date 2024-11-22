import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaEye, FaUsers, FaArrowLeft } from "react-icons/fa";
import DetailView from "./detailView";

const ManageAppraisal = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, detail, responses

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const fetchAppraisals = async () => {
    try {
      const response = await fetch("/api/appraisal/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch appraisals");
      }
      const data = await response.json();
      setAppraisals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setViewMode("detail");
  };

  const handleViewResponses = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setViewMode("responses");
  };

  const handleDelete = async (appraisal) => {
    if (
      window.confirm("Are you sure you want to delete this appraisal template?")
    ) {
      try {
        const response = await fetch("/api/appraisal/getAll", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: appraisal.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete appraisal");
        }

        // Refresh the list
        fetchAppraisals();
      } catch (error) {
        console.error("Error deleting appraisal:", error);
      }
    }
  };

  const handleEdit = (appraisal) => {
    console.log("Edit appraisal:", appraisal);
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

  return (
    <div className="min-h-[60vh] bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 p-6">
      {viewMode === "list" && (
        <div className="space-y-4">
          {appraisals.map((appraisal) => (
            <div
              key={appraisal.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#062341]">
                    {appraisal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {appraisal.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500">
                      {appraisal.categories.length} Categories
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {appraisal.studentResponses.length} Responses
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(appraisal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleViewResponses(appraisal)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="View Responses"
                  >
                    <FaUsers />
                  </button>
                  <button
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(appraisal)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "detail" && selectedAppraisal && (
        <DetailView
          appraisal={selectedAppraisal}
          onBack={() => {
            setViewMode("list");
            setSelectedAppraisal(null);
          }}
          onEdit={handleEdit}
        />
      )}

      {/* Add ResponseView component later */}
    </div>
  );
};

export default ManageAppraisal;
