import { useState, useEffect, useCallback, useRef } from "react";
import { FaBullhorn, FaLink, FaFilter, FaClock } from "react-icons/fa";
import ProgressiveImage from "../../UI/progressiveImage";
import { motion } from "framer-motion";

const AnnouncementSkeleton = () => (
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

const AnnouncementSidebar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");

  const observer = useRef();
  const lastAnnouncementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchAnnouncements = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/getAnnouncements?page=${page}`);
      const data = await response.json();

      setAnnouncements((prevAnnouncements) => {
        if (page === 1) return data.announcements;
        const combinedAnnouncements = [
          ...prevAnnouncements,
          ...data.announcements,
        ];
        return Array.from(
          new Map(
            combinedAnnouncements.map((announcement) => [
              announcement.resource_id,
              announcement,
            ])
          ).values()
        );
      });

      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    fetchAnnouncements();
  }, [page, fetchAnnouncements]);

  const isWithinDateRange = (date) => {
    const itemDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return itemDate >= today && itemDate <= todayEnd;
      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return itemDate >= weekStart && itemDate <= weekEnd;
      case "month":
        return (
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    isWithinDateRange(announcement.createdAt)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-8 max-w-5xl mx-auto"
    >
      {/* Title Card */}
      <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8">
          <h1 className="text-3xl font-bold text-white text-center">
            Announcements
          </h1>
          <p className="text-white/80 text-center mt-2">
            Stay updated with the latest announcements
          </p>
        </div>
      </div>

      {/* Date Filter - Enhanced */}
      <div className="sticky top-4 z-10 bg-white/90 backdrop-blur-xl py-4 px-6 rounded-2xl shadow-lg border border-[#0B6EC9]/10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#062341] font-semibold">Filter Announcements</h3>
          <span className="text-sm text-[#062341]/60">
            {filteredAnnouncements.length} announcement
            {filteredAnnouncements.length !== 1 ? "s" : ""} found
          </span>
        </div>
        <div className="flex justify-center gap-2">
          {["all", "today", "week", "month"].map((option) => (
            <button
              key={option}
              className={`
                flex-1 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
                ${
                  dateFilter === option
                    ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-lg transform scale-105"
                    : "bg-white text-[#062341] hover:bg-[#E6F0F9] hover:shadow-md"
                }
              `}
              onClick={() => setDateFilter(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-8">
        {filteredAnnouncements.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0B6EC9]/10 p-12"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#0B6EC9]/10 rounded-full flex items-center justify-center mb-6">
                <FaFilter className="text-3xl text-[#0B6EC9]" />
              </div>
              <h3 className="text-2xl font-bold text-[#062341] mb-3">
                No Announcements Found
              </h3>
              <p className="text-[#062341]/70 max-w-md">
                There are no announcements matching your current filter. Try
                adjusting your filters or check back later!
              </p>
            </div>
          </motion.div>
        ) : (
          filteredAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.resource_id}
              ref={
                index === filteredAnnouncements.length - 1
                  ? lastAnnouncementRef
                  : null
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/95 hover:bg-gradient-to-br hover:from-white/95 hover:to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl border border-[#0B6EC9]/10 overflow-hidden transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center text-white">
                    <FaBullhorn className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#062341] mb-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-[#062341]/60">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {announcement.img_path && (
                  <div className="relative w-full h-72 mb-6 rounded-xl overflow-hidden group-hover:shadow-lg transition-all duration-300">
                    <ProgressiveImage
                      src={announcement.img_path}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-[#062341]/70 mb-6 leading-relaxed">
                  {announcement.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#062341]/60 text-sm">
                    <FaClock className="text-[#0B6EC9]" />
                    <span>
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {announcement.link && (
                    <a
                      href={announcement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0B6EC9] text-sm hover:underline"
                    >
                      <FaLink />
                      <span>View Details</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        {loading && (
          <div className="space-y-8">
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnnouncementSidebar;
