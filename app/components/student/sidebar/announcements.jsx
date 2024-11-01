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
  FaLock,
} from "react-icons/fa";
import RegisterEvent from "../modals/registerEvent";
import ProgressiveImage from "../../UI/progressiveImage";

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
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        return (
          eventDate >= today &&
          eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        );
      case "week":
        const weekStart = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return eventDate >= weekStart && eventDate < weekEnd;
      case "month":
        return (
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  };

  const filteredFeedItems = feedItems.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (item.type === "event" && !isWithinDateRange(item.date_time))
      return false;
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
      const eventIsRegistered =
        isRegistered(item.event_id) || item.isRegistered;
      const eventPassed = isEventPassed(item.date_time);
      return (
        <div
          key={item.event_id}
          className="w-[90%] bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-bold text-[#0B6EC9]">{item.title}</h2>
            <div className="flex items-center gap-2">
              {item.forDepartment && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {item.forDepartment} Only
                </span>
              )}
              {eventPassed && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Closed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <FaCalendarAlt className="mr-2" />
            <p>
              {new Date(item.date_time).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {item.location && (
            <div className="flex items-center text-gray-600 mb-3">
              <FaMapMarkerAlt className="mr-2" />
              <p>{item.location}</p>
            </div>
          )}
          <p className="text-gray-700 mb-4">{item.description}</p>
          {item.img_path && (
            <div className="mb-4">
              <ProgressiveImage
                src={item.img_path}
                alt={item.title}
                className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          {item.link && (
            <div className="flex items-center text-[#0B6EC9] mb-4 hover:underline">
              <FaLink className="mr-2" />
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Event Link
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <FaUserFriends className="mr-2" />
              <p>{registrationCounts[item.event_id] || 0} registered</p>
            </div>
            {eventIsRegistered ? (
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md cursor-not-allowed flex items-center opacity-75"
                disabled
              >
                <FaCheck className="mr-2" />
                Registered
              </button>
            ) : eventPassed ? (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow-md cursor-not-allowed flex items-center"
                disabled
              >
                <FaClock className="mr-2" />
                Event Closed
              </button>
            ) : !item.canRegister ? (
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow-md cursor-not-allowed flex items-center"
                disabled
              >
                <FaLock className="mr-2" />
                Department Restricted
              </button>
            ) : (
              <button
                className="bg-[#0B6EC9] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#062341] transition-colors duration-300 flex items-center"
                onClick={() => handleRegister(item)}
              >
                <FaCalendarAlt className="mr-2" />
                Register
              </button>
            )}
          </div>
        </div>
      );
    } else if (item.type === "announcement") {
      return (
        <div
          key={item.resource_id}
          className="w-[90%] bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex items-center mb-3">
            <FaBullhorn className="text-[#0B6EC9] mr-2" />
            <h2 className="text-2xl font-bold text-[#0B6EC9]">{item.title}</h2>
          </div>
          <p className="text-gray-700 mb-4">{item.description}</p>
          {item.img_path && (
            <div className="mb-4">
              <ProgressiveImage
                src={item.img_path}
                alt={item.title}
                className="w-full h-auto max-h-[300px] object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          {item.link && (
            <div className="flex items-center text-[#0B6EC9] mb-4 hover:underline">
              <FaLink className="mr-2" />
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                Related Link
              </a>
            </div>
          )}
          <div className="text-gray-600 text-sm">
            Posted on: {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div
        className="newsfeed absolute xl:w-[55%] xl:h-[85%] xl:translate-x-[41%] xl:translate-y-[15%] 2xl:translate-y-[13%] rounded-[20px] flex flex-col items-center overflow-y-auto bg-[#dfecf6] gap-2"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#0B6EC9 #dfecf6",
        }}
      >
        <style jsx global>{`
          .newsfeed::-webkit-scrollbar {
            width: 8px;
          }
          .newsfeed::-webkit-scrollbar-track {
            background: #dfecf6;
            border-radius: 10px;
          }
          .newsfeed::-webkit-scrollbar-thumb {
            background: #0b6ec9;
            border-radius: 10px;
          }
          .newsfeed::-webkit-scrollbar-thumb:hover {
            background: #062341;
          }
        `}</style>
        <h1 className="text-3xl font-bold mb-6 text-[#0B6EC9] mt-[5%]">
          Student Feed
        </h1>
        {renderFilterButtons()}
        {filteredFeedItems.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FaFilter className="text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              No items to display for the selected filters.
            </p>
            <p className="text-gray-500">
              Try changing the filters or check back later!
            </p>
          </div>
        ) : (
          filteredFeedItems.map(renderFeedItem)
        )}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B6EC9]"></div>
          </div>
        )}
        {!hasMore && feedItems.length > 0 && (
          <p className="text-gray-500 py-4">No more items to load</p>
        )}
      </div>
      {showRegisterModal && selectedEvent && (
        <RegisterEvent
          event={selectedEvent}
          onClose={handleCloseModal}
          onRegister={handleConfirmRegistration}
        />
      )}
    </>
  );
};

export default StudentFeed;
