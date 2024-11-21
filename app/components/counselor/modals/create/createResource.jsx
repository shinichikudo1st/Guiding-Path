import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { FaCalendar, FaClock, FaLink, FaSpinner, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import ResourceModal from "./createResourceModal";
import ViewResourceModal from "./viewResource";

const CreateResource = () => {
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getResources?page=${currentPage}`);
      const data = await response.json();
      if (response.ok) {
        setResources(data.resources);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch resources:", data.message);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentPage, refreshKey]);

  const handleCreateModalClose = () => {
    setCreateModal(false);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setViewModal(true);
  };

  const handleViewModalClose = () => {
    setViewModal(false);
    setSelectedResource(null);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <>
      {createModal && <ResourceModal closeButton={handleCreateModalClose} />}
      {viewModal && selectedResource && (
        <ViewResourceModal
          resource={selectedResource}
          closeModal={handleViewModalClose}
          onUpdate={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      )}
      <div className="relative flex flex-col min-h-[calc(60vh-2rem)]">
        {/* Main Content */}
        <div className="flex-grow space-y-6 pb-24">
          {isLoading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
              <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
                Loading resources...
              </p>
            </div>
          ) : resources && resources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {resources.map((resource) => (
                <motion.div
                  key={resource.resource_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-[#062341] mb-2">
                          {resource.title}
                        </h3>
                        <div className="flex items-center text-sm text-[#062341]/70 space-x-4">
                          <div className="flex items-center">
                            <FaCalendar className="mr-2" />
                            <span>
                              {new Date(
                                resource.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-2" />
                            <span>
                              {new Date(
                                resource.createdAt
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-[#0B6EC9] hover:text-[#095396] mt-2 group"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaLink className="mr-2 transition-transform group-hover:scale-110" />
                            Resource Link
                          </a>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewResource(resource)}
                        className="flex items-center px-3 py-1.5 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg hover:from-[#095396] hover:to-[#084B87] transition-all duration-300"
                      >
                        <AiFillEye className="mr-1.5" />
                        View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-[#062341]/70">
              <FaLink className="text-6xl mb-4" />
              <p className="text-xl font-medium">No resources found</p>
              <p className="text-sm mt-2">
                Click the + button to create a new resource
              </p>
            </div>
          )}
        </div>

        {/* Fixed Pagination */}
        {resources && resources.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-[#0B6EC9]/10 py-4 px-8">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <p className="text-sm text-[#062341]/70">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex gap-2 mr-20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 bg-white text-[#062341] rounded-lg border border-[#0B6EC9]/20 hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <IoChevronBackOutline className="text-lg" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 bg-white text-[#062341] rounded-lg border border-[#0B6EC9]/20 hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <IoChevronForwardOutline className="text-lg" />
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCreateModal(true)}
          className="fixed bottom-20 right-8 flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-full shadow-lg hover:from-[#095396] hover:to-[#084B87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B6EC9] transition-all duration-300 z-10"
        >
          <FaPlus className="text-xl" />
        </motion.button>
      </div>
    </>
  );
};

export default CreateResource;
