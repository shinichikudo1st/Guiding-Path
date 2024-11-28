import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaHeart, FaEye, FaSpinner, FaBookOpen } from "react-icons/fa";
import ResourceModal from "./viewResource";
import { motion } from "framer-motion";

const ResourceSkeleton = () => (
  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 p-6 mb-4 animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 bg-gray-200 rounded-xl" />
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
      </div>
    </div>
    <div className="h-72 bg-gray-200 rounded-xl mb-6" />
    <div className="h-20 bg-gray-200 rounded-xl mb-6" />
    <div className="h-12 bg-gray-200 rounded-xl w-full" />
  </div>
);

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
      className="relative min-h-screen pt-20 md:pt-24 pb-8 px-4 md:px-6 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto lg:ml-72 lg:mr-72 2xl:mx-auto space-y-6 md:space-y-8">
        <div className="space-y-8">
          {/* Title Card */}
          <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Resources
              </h2>
              <p className="text-white/80 text-center mt-2">
                Discover and access learning materials
              </p>
            </div>
          </div>

          {/* Resources Feed */}
          {resources.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0B6EC9]/10 p-12"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#0B6EC9]/10 rounded-full flex items-center justify-center mb-6">
                  <FaBookOpen className="text-3xl text-[#0B6EC9]" />
                </div>
                <h3 className="text-2xl font-bold text-[#062341] mb-3">
                  No Resources Found
                </h3>
                <p className="text-[#062341]/70 max-w-md">
                  There are no resources available at the moment. Please check
                  back later!
                </p>
              </div>
            </motion.div>
          ) : (
            resources.map((resource, index) => (
              <motion.div
                key={resource.resource_id}
                ref={
                  index === resources.length - 1 ? lastResourceElementRef : null
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/95 hover:bg-gradient-to-br hover:from-white/95 hover:to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl border border-[#0B6EC9]/10 overflow-hidden transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center text-white">
                        <FaBookOpen className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#062341] mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-[#062341]/60">
                          {formatDate(resource.createdAt)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLike(resource.resource_id)}
                      className="p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                    >
                      <FaHeart
                        className={`${
                          likedResources.has(resource.resource_id)
                            ? "text-red-500"
                            : "text-red-300"
                        }`}
                        size={20}
                      />
                    </motion.button>
                  </div>

                  {resource.img_path && (
                    <div className="relative w-full h-72 mb-6 rounded-xl overflow-hidden group-hover:shadow-lg transition-all duration-300">
                      <Image
                        src={resource.img_path}
                        alt={resource.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <p className="text-[#062341]/70 mb-6 leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openResourceModal(resource)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl hover:from-[#095396] hover:to-[#084B87] transition-all duration-300"
                      >
                        <FaEye className="text-sm" />
                        <span>View Resource</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {loading && (
            <div className="space-y-8">
              <ResourceSkeleton />
              <ResourceSkeleton />
            </div>
          )}

          {selectedResource && (
            <ResourceModal
              resource={selectedResource}
              onClose={closeResourceModal}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceFeed;
