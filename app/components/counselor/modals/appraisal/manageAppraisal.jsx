import { useState, useEffect } from "react";
import { FaTrash, FaEye, FaUsers } from "react-icons/fa";
import DetailView from "./manage/detailView";
import ViewResponse from "./manage/viewResponse";
import { motion } from "framer-motion";
import DeleteConfirmation from "./manage/deleteConfirmation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const ManageAppraisal = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAppraisals(currentPage);
  }, [currentPage]);

  const fetchAppraisals = async (page) => {
    try {
      const response = await fetch(
        `/api/appraisal/getAll?page=${page}&limit=4`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appraisals");
      }
      const data = await response.json();
      setAppraisals(data.appraisals);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
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
    setDeleteConfirmation(appraisal);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/appraisal/getAll", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteConfirmation.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete appraisal");
      }

      await fetchAppraisals(currentPage);
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting appraisal:", error);
    } finally {
      setIsDeleting(false);
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
    <motion.div
      className="bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="min-h-[60vh] flex flex-col justify-between">
        {viewMode === "list" && (
          <>
            <div className="flex-grow">
              <div className="space-y-4 p-6">
                {appraisals.map((appraisal) => (
                  <div
                    key={appraisal.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-[#0B6EC9]/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-[#062341] mb-2">
                          {appraisal.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {appraisal.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1.5 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-full text-sm font-medium">
                            {appraisal.categories.length} Categories
                          </span>
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {appraisal.studentResponses.length} Responses
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(appraisal)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                          title="View Details"
                        >
                          <FaEye className="text-lg" />
                          <span className="font-medium">Details</span>
                        </button>
                        <button
                          onClick={() => handleViewResponses(appraisal)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                          title="View Responses"
                        >
                          <FaUsers className="text-lg" />
                          <span className="font-medium">Responses</span>
                        </button>
                        <button
                          onClick={() => handleDelete(appraisal)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm hover:shadow transition-all duration-300"
                          title="Delete"
                        >
                          <FaTrash className="text-lg" />
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-t border-[#0B6EC9]/10 p-3 mt-auto">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#062341]/70">
                  Page <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                  >
                    <IoChevronBackOutline className="w-4 h-4 text-[#062341]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                  >
                    <IoChevronForwardOutline className="w-4 h-4 text-[#062341]" />
                  </motion.button>
                </div>
              </div>
            </div>
          </>
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

        {viewMode === "responses" && selectedAppraisal && (
          <ViewResponse
            appraisal={selectedAppraisal}
            onBack={() => {
              setViewMode("list");
              setSelectedAppraisal(null);
            }}
          />
        )}

        {deleteConfirmation && (
          <DeleteConfirmation
            appraisal={deleteConfirmation}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteConfirmation(null)}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ManageAppraisal;
