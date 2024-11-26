import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaHeart, FaEye, FaSpinner, FaBookOpen } from "react-icons/fa";
import ResourceModal from "./viewResource";
import { motion } from "framer-motion";

const ResourceSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen pt-24 pb-8"
      style={{ marginLeft: "16rem", marginRight: "16rem", zIndex: 1 }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title Card */}
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Resources
            </h2>
          </div>
        </div>

        {/* Resources Feed */}
        {resources.map((resource, index) => (
          <motion.div
            key={resource.resource_id}
            ref={index === resources.length - 1 ? lastResourceElementRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {resource.title.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#062341]">
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
                  className="p-2 rounded-full hover:bg-red-50"
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
                <div className="relative w-full h-72 mb-4">
                  <Image
                    src={resource.img_path}
                    alt={resource.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <p className="text-[#062341]/70 mb-4 line-clamp-3">
                {resource.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openResourceModal(resource)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg"
              >
                <FaEye />
                View Resource
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
              <ResourceSkeleton />
            </div>
            <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
              <ResourceSkeleton />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && resources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden p-8"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <FaBookOpen className="text-4xl text-[#0B6EC9]/30 mb-4" />
              <h3 className="text-xl font-semibold text-[#062341]">
                No Resources Found
              </h3>
              <p className="text-[#062341]/70 mt-2">
                Check back later for new resources
              </p>
            </div>
          </motion.div>
        )}
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
