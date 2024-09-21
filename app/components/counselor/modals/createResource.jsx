import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { FaCalendar, FaClock, FaLink, FaSpinner } from "react-icons/fa";
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
      <div className="absolute mt-[10%] w-[80%] h-[70%] bg-[#F0F7FF] shadow-lg rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="space-y-4 p-4 overflow-auto h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
              <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
                Loading resources...
              </p>
            </div>
          ) : resources && resources.length > 0 ? (
            resources.map((resource) => (
              <div
                key={resource.resource_id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {resource.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendar className="mr-2" />
                    <span>
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                    <FaClock className="ml-4 mr-2" />
                    <span>
                      {new Date(resource.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaLink className="mr-2" />
                      Resource Link
                    </a>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleViewResource(resource)}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
                  >
                    <AiFillEye className="mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>No resources found.</p>
              <p>Click the + button to create a new resource.</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="fixed bottom-8 right-8 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0B6EC9] text-white shadow-lg hover:bg-[#095396] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B6EC9] transition-all duration-300 transform hover:scale-110"
          title="Create New Resource"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        <div className="mt-auto p-4 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <IoChevronBackOutline
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <IoChevronForwardOutline
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateResource;
