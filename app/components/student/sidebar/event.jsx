import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLink,
  FaCheck,
  FaFilter,
  FaClock,
} from "react-icons/fa";
import RegisterEvent from "../modals/registerEvent";
import ProgressiveImage from "../../UI/progressiveImage";
import { motion } from "framer-motion";

const EventSkeleton = () => (
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

const EventSidebar = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registrationCounts, setRegistrationCounts] = useState({});
  const [dateFilter, setDateFilter] = useState("all");

  const observer = useRef();
  const lastEventRef = useCallback(
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

  const fetchEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/getEvents?page=${page}`);
      const data = await response.json();

      setEvents((prevEvents) => {
        if (page === 1) return data.events;
        const combinedEvents = [...prevEvents, ...data.events];
        return Array.from(
          new Map(
            combinedEvents.map((event) => [event.event_id, event])
          ).values()
        );
      });

      setHasMore(data.currentPage < data.totalPages);
      if (data.events.length > 0) {
        fetchRegistrationCounts(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchEvents();
    if (page === 1) {
      fetchRegisteredEvents();
    }
  }, [page]);

  // Reuse these functions from announcements.jsx
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
      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Failed to register for event");
      }

      setRegisteredEvents((prev) => [...prev, eventId]);
      setRegistrationCounts((prev) => ({
        ...prev,
        [eventId]: (prev[eventId] || 0) + 1,
      }));
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.event_id === eventId
            ? {
                ...event,
                isRegistered: true,
                registrationCount: (event.registrationCount || 0) + 1,
              }
            : event
        )
      );

      handleCloseModal();
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

  const filteredEvents = events.filter((event) => {
    if (dateFilter !== "all") {
      return isWithinDateRange(event.date_time);
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 md:pt-24 pb-8 px-4 md:px-6 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto lg:ml-72 lg:mr-72 2xl:mx-auto space-y-6 md:space-y-8">
        {/* Title Card */}
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Student Events
            </h1>
            <p className="text-white/80 text-center mt-2">
              Discover and register for upcoming events
            </p>
          </div>
        </div>

        {/* Date Filter - Enhanced */}
        <div className="sticky top-4 z-10 bg-white/90 backdrop-blur-xl py-4 px-6 rounded-2xl shadow-lg border border-[#0B6EC9]/10 mb-8 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#062341] font-semibold">Filter Events</h3>
            <span className="text-sm text-[#062341]/60">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {["all", "today", "week", "month"].map((option) => (
              <button
                key={option}
                className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  dateFilter === option
                    ? "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white shadow-lg transform scale-105"
                    : "bg-white text-[#062341] hover:bg-[#E6F0F9] hover:shadow-md"
                }`}
                onClick={() => setDateFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events List - Enhanced */}
        <div className="space-y-8">
          {filteredEvents.length === 0 && !loading ? (
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
                  No Events Found
                </h3>
                <p className="text-[#062341]/70 max-w-md">
                  There are no events matching your current filter. Try
                  adjusting your filters or check back later for new events!
                </p>
              </div>
            </motion.div>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.event_id}
                ref={index === filteredEvents.length - 1 ? lastEventRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/95 hover:bg-gradient-to-br hover:from-white/95 hover:to-[#E6F0F9]/95 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl border border-[#0B6EC9]/10 overflow-hidden transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center text-white">
                        <FaCalendarAlt className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#062341]">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#062341]/70">
                          {event.department}
                        </p>
                      </div>
                    </div>
                    {event.forDepartment && (
                      <span className="bg-[#0B6EC9]/10 text-[#0B6EC9] text-xs font-medium px-3 py-1 rounded-full">
                        {event.forDepartment} Only
                      </span>
                    )}
                  </div>

                  {event.img_path && (
                    <div className="relative w-full h-72 mb-4 rounded-lg overflow-hidden">
                      <ProgressiveImage
                        src={event.img_path}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-[#062341]/70 mb-4">{event.description}</p>

                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10 space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                      <FaClock className="text-[#0B6EC9]" />
                      <span>{new Date(event.date_time).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                        <FaMapMarkerAlt className="text-[#0B6EC9]" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#062341]/80 text-sm">
                      <FaUserFriends className="text-[#0B6EC9]" />
                      <span>
                        {registrationCounts[event.event_id] || 0} registered
                      </span>
                    </div>
                  </div>

                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0B6EC9] text-sm hover:underline mb-4"
                    >
                      <FaLink />
                      <span>Event Link</span>
                    </a>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRegister(event)}
                    disabled={
                      isEventPassed(event.date_time) ||
                      isRegistered(event.event_id)
                    }
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      isRegistered(event.event_id)
                        ? "bg-green-100 text-green-600"
                        : isEventPassed(event.date_time)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : event.forDepartment && event.forDepartment !== event.userDepartment
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white hover:from-[#095396] hover:to-[#084B87]"
                    }`}
                  >
                    {isRegistered(event.event_id) ? (
                      <>
                        <FaCheck />
                        Registered
                      </>
                    ) : isEventPassed(event.date_time) ? (
                      "Event Closed"
                    ) : event.forDepartment && event.forDepartment !== event.userDepartment ? (
                      "Not Available for Your Department"
                    ) : (
                      "Register Now"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}

          {loading && (
            <div className="space-y-8">
              <EventSkeleton />
              <EventSkeleton />
            </div>
          )}
        </div>

        {showRegisterModal && selectedEvent && (
          <RegisterEvent
            event={selectedEvent}
            onClose={handleCloseModal}
            onRegister={handleConfirmRegistration}
          />
        )}
      </div>
    </motion.div>
  );
};

export default EventSidebar;
