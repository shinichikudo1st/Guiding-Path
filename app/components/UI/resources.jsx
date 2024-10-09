import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FaHeart, FaEye } from "react-icons/fa";
import ResourceModal from "./viewResource";

const ResourceFeed = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

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
  }, [page]);

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

  return (
    <>
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={closeResourceModal}
        />
      )}
      <div className="resourceContainer absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#062341]">Resources</h2>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 w-[90%] text-center">
            {error}
          </p>
        )}
        <div className="w-full px-[5%] flex flex-col gap-6">
          {resources.map((resource, index) => (
            <div
              key={resource.resource_id}
              ref={
                index === resources.length - 1 ? lastResourceElementRef : null
              }
              className="bg-white p-6 rounded-xl shadow-lg w-full mb-6 transition-all duration-300 hover:shadow-xl relative"
            >
              <button className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <FaHeart
                  className="text-red-400 hover:text-red-600 transition-colors duration-200"
                  size={24}
                />
              </button>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">
                  {resource.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(resource.createdAt)}
                  </p>
                </div>
              </div>
              {resource.img_path && (
                <div className="mb-4 relative w-full h-72 rounded-lg overflow-hidden">
                  <Image
                    src={resource.img_path}
                    alt={resource.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200 inline-block"
                  >
                    Learn More
                  </a>
                )}
                <button
                  onClick={() => openResourceModal(resource)}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 inline-flex items-center"
                >
                  <FaEye className="mr-2" /> View
                </button>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex items-center justify-center w-full py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!loading && !hasMore && (
          <p className="text-gray-600 italic mb-4">
            No more resources to load.
          </p>
        )}
        {!loading && hasMore && (
          <button
            onClick={loadMoreResources}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors mb-6 font-semibold"
          >
            Load More Resources
          </button>
        )}
      </div>
    </>
  );
};

export default ResourceFeed;
