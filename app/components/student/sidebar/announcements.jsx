import { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLink,
  FaCheck,
  FaBullhorn,
  FaFilter,
  FaClock,
} from "react-icons/fa";
import RegisterEvent from "../modals/registerEvent";
import ProgressiveImage from "../../UI/progressiveImage";
import { motion } from "framer-motion";

const StudentFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const fetchFeedItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const [eventsResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/getEvents?page=${page}`),
        fetch(`/api/getAnnouncements?page=${page}`),
      ]);
      const eventsData = await eventsResponse.json();
      const announcementsData = await announcementsResponse.json();

      const newEvents = eventsData.events.map((event) => ({
        ...event,
        type: "event",
        createdAt: event.date_time,
      }));
      const newAnnouncements = announcementsData.announcements.map(
        (announcement) => ({
          ...announcement,
          type: "announcement",
        })
      );

      setFeedItems((prevItems) => {
        const combinedItems = [...prevItems, ...newEvents, ...newAnnouncements];
        const uniqueItems = Array.from(
          new Map(
            combinedItems.map((item) => [
              item.type === "event" ? item.event_id : item.resource_id,
              item,
            ])
          ).values()
        );
        return uniqueItems.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      });

      setPage((prevPage) => prevPage + 1);
      setHasMore(
        eventsData.currentPage < eventsData.totalPages ||
          announcementsData.currentPage < announcementsData.totalPages
      );
      fetchRegistrationCounts(eventsData.events);
    } catch (error) {
      console.error("Error fetching feed items:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    fetchFeedItems();
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const response = await fetch("/api/getRegisteredEvents");
      const data = await response.json();
      setRegisteredEvents(data.registeredEventIds || []);
    } catch (error) {
      console.error("Error fetching registered events:", error);
    }
  };

  const fetchRegistrationCounts = async (eventsToFetch) => {
    try {
      const counts = await Promise.all(
        eventsToFetch.map(async (event) => {
          const response = await fetch(
            `/api/getRegisterCount?eventId=${event.event_id}`
          );
          const data = await response.json();
          return { [event.event_id]: data.count };
        })
      );
      setRegistrationCounts((prevCounts) => ({
        ...prevCounts,
        ...Object.assign({}, ...counts),
      }));
    } catch (error) {
      console.error("Error fetching registration counts:", error);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      fetchFeedItems();
    }
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setSelectedEvent(null);
  };

  const handleConfirmRegistration = async (eventId) => {
    try {
      setRegisteredEvents((prev) => [...prev, eventId]);
      setRegistrationCounts((prev) => ({
        ...prev,
        [eventId]: (prev[eventId] || 0) + 1,
      }));
      // Update the specific event in the feedItems
      setFeedItems((prevItems) =>
        prevItems.map((item) =>
          item.event_id === eventId ? { ...item, isRegistered: true } : item
        )
      );
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const isRegistered = (eventId) => registeredEvents.includes(eventId);

  const isEventPassed = (eventDateTime) => {
    return new Date(eventDateTime) < new Date();
  };

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

  const filteredFeedItems = feedItems.filter((item) => {
    // First filter by type (event/announcement)
    if (filter !== "all" && item.type !== filter) return false;

    // Then filter by date
    if (dateFilter !== "all") {
      if (item.type === "event") {
        return isWithinDateRange(item.date_time);
      } else {
        // For announcements, use createdAt
        return isWithinDateRange(item.createdAt);
      }
    }
    return true;
  });

  const renderFilterButtons = () => (
    <div className="sticky top-0 z-10 bg-[#dfecf6] py-4 px-6 rounded-b-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between max-w-3xl mx-auto mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Filter by Type
          </h3>
          <div className="flex justify-center space-x-2">
            {["all", "event", "announcement"].map((filterType) => (
              <button
                key={filterType}
                className={`
                  flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    filter === filterType
                      ? "bg-[#0B6EC9] text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
                onClick={() => setFilter(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Filter by Date
          </h3>
          <div className="flex justify-center">
            {["all", "today", "week", "month"].map((option) => (
              <button
                key={option}
                className={`
                  flex-1 px-4 py-2 text-sm font-medium transition-all duration-300
                  ${
                    dateFilter === option
                      ? "bg-[#0B6EC9] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                  ${option === "all" ? "rounded-l-full" : ""}
                  ${option === "month" ? "rounded-r-full" : ""}
                `}
                onClick={() => setDateFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedItem = (item) => {
    if (item.type === "event") {
      const isRegistered = registeredEvents.includes(item.event_id);
      const isClosed = new Date(item.date_time) < new Date();

      return (
        <motion.div
          key={item.event_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5 overflow-hidden max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/80">{item.department}</p>
                </div>
              </div>
              {item.forDepartment && (
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {item.forDepartment} Only
                </span>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {item.img_path && (
              <div className="rounded-lg overflow-hidden">
                <ProgressiveImage
                  src={item.img_path}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#0B6EC9]/10 space-y-2">
              <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                <FaClock className="text-[#0B6EC9] text-base" />
                <span>{new Date(item.date_time).toLocaleString()}</span>
                {isClosed && (
                  <span className="ml-2 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                    Closed
                  </span>
                )}
              </div>
              {item.location && (
                <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                  <FaMapMarkerAlt className="text-[#0B6EC9] text-base" />
                  <span>{item.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                <FaUserFriends className="text-[#0B6EC9] text-base" />
                <span>{registrationCounts[item.event_id] || 0} registered</span>
              </div>
            </div>

            <p className="text-[#062341]/80 text-sm">{item.description}</p>

            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0B6EC9] text-sm hover:underline"
              >
                <FaLink />
                <span>Event Link</span>
              </a>
            )}

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRegister(item)}
                disabled={isClosed || isRegistered}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isRegistered
                    ? "bg-green-100 text-green-600 cursor-default"
                    : isClosed
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white hover:from-[#095396] hover:to-[#084B87]"
                }`}
              >
                {isRegistered ? (
                  <>
                    <FaCheck className="inline mr-2" />
                    Registered
                  </>
                ) : isClosed ? (
                  "Event Closed"
                ) : (
                  "Register Now"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    }

    // Announcement rendering (similar styling)
    return (
      <motion.div
        key={item.resource_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5 overflow-hidden max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-lg">
              <FaBullhorn className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {item.img_path && (
            <div className="rounded-lg overflow-hidden">
              <ProgressiveImage
                src={item.img_path}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <p className="text-[#062341]/80 text-sm">{item.description}</p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#0B6EC9] text-sm hover:underline"
            >
              <FaLink />
              <span>Related Link</span>
            </a>
          )}

          <div className="text-[#062341]/60 text-xs">
            Posted on: {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              Student Feed
            </h1>
          </div>

          <div className="p-8 sm:p-10 space-y-8">
            {renderFilterButtons()}

            <div
              className="overflow-y-auto max-h-[calc(100vh-20rem)] scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#0B6EC9]/40"
              onScroll={handleScroll}
            >
              {filteredFeedItems.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <FaFilter className="text-6xl text-gray-400 mb-4" />
                  <p className="text-xl text-gray-600">
                    No items to display for the selected filters.
                  </p>
                  <p className="text-gray-500">
                    Try changing the filters or check back later!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFeedItems.map(renderFeedItem)}
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B6EC9]"></div>
                </div>
              )}

              {!hasMore && feedItems.length > 0 && (
                <p className="text-center text-gray-500 py-4">
                  No more items to load
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRegisterModal && selectedEvent && (
        <RegisterEvent
          event={selectedEvent}
          onClose={handleCloseModal}
          onRegister={handleConfirmRegistration}
        />
      )}
    </motion.div>
  );
};

export default StudentFeed;
