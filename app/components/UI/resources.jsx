import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaHeart, FaEye, FaSpinner, FaBookOpen } from "react-icons/fa";
import ResourceModal from "./viewResource";
import { motion } from "framer-motion";

const ResourceFeed = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const [likedResources, setLikedResources] = useState(new Set());

  const observer = useRef();
  const lastResourceElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreResources();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchResources = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getResources?page=${pageNum}`);
      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }
      const data = await response.json();

      // Use a Set to ensure uniqueness
      const uniqueResources = Array.from(
        new Map(
          [...resources, ...data.resources].map((item) => [
            item.resource_id,
            item,
          ])
        ).values()
      );
      setResources(uniqueResources);

      setHasMore(data.currentPage < data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(page);
    fetchLikedResources();
  }, [page]);

  const fetchLikedResources = async () => {
    try {
      const response = await fetch("/api/updateUserResources");
      if (!response.ok) {
        throw new Error("Failed to fetch liked resources");
      }
      const data = await response.json();
      setLikedResources(new Set(data.likedResources.map((r) => r.resource_id)));
    } catch (error) {
      console.error("Error fetching liked resources:", error);
    }
  };

  const loadMoreResources = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openResourceModal = async (resource) => {
    setSelectedResource(resource);
    try {
      const response = await fetch("/api/createResourcesData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceID: resource.resource_id }),
      });
      if (!response.ok) {
        throw new Error("Failed to create resource");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  const closeResourceModal = () => {
    setSelectedResource(null);
  };

  const toggleLike = async (resourceId) => {
    try {
      const response = await fetch(
        `/api/updateUserResources?resourceId=${resourceId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update resource");
      }
      setLikedResources((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(resourceId)) {
          newSet.delete(resourceId);
        } else {
          newSet.add(resourceId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Learning Resources
            </h1>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#dfecf6] max-h-[calc(100vh-20rem)]">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              {loading ? (
                <div className="flex items-center justify-center w-full h-40">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-xl font-semibold"
                  >
                    <FaSpinner className="animate-spin h-5 w-5" />
                    Loading Resources...
                  </motion.div>
                </div>
              ) : resources.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 text-center"
                >
                  <FaBookOpen className="text-4xl text-[#0B6EC9]/30 mb-4" />
                  <h3 className="text-xl font-semibold text-[#062341]">
                    No Resources Found
                  </h3>
                  <p className="text-[#062341]/70 mt-2">
                    Check back later for new resources
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {resources.map((resource, index) => (
                    <motion.div
                      key={resource.resource_id}
                      ref={
                        index === resources.length - 1
                          ? lastResourceElementRef
                          : null
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                              {resource.title.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-[#062341] line-clamp-1">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-[#062341]/70">
                                {formatDate(resource.createdAt)}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleLike(resource.resource_id)}
                            className="p-2 rounded-full hover:bg-red-50 transition-all duration-200"
                          >
                            <FaHeart
                              className={`${
                                likedResources.has(resource.resource_id)
                                  ? "text-red-500"
                                  : "text-red-300"
                              } hover:text-red-500 transition-colors duration-200`}
                              size={20}
                            />
                          </motion.button>
                        </div>

                        <div className="flex-1 flex flex-col">
                          {resource.img_path && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={resource.img_path}
                                alt={resource.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          <p className="text-[#062341]/70 text-sm line-clamp-3 mb-4">
                            {resource.description}
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openResourceModal(resource)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 mt-4"
                        >
                          <FaEye />
                          View Resource
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={closeResourceModal}
        />
      )}
    </motion.div>
  );
};

export default ResourceFeed;
