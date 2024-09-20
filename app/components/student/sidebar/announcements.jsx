import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLink,
  FaCheck,
  FaBullhorn,
} from "react-icons/fa";
import RegisterEvent from "../modals/registerEvent";

const StudentFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registrationCounts, setRegistrationCounts] = useState({});

  const fetchFeedItems = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const [eventsResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/getEvents?page=${page}`),
        fetch(`/api/getAnnouncements?page=${page}`),
      ]);
      const eventsData = await eventsResponse.json();
      const announcementsData = await announcementsResponse.json();

      const combinedItems = [
        ...eventsData.events.map((event) => ({ ...event, type: "event" })),
        ...announcementsData.announcements.map((announcement) => ({
          ...announcement,
          type: "announcement",
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (page === 1) {
        setFeedItems(combinedItems);
      } else {
        setFeedItems((prevItems) => [...prevItems, ...combinedItems]);
      }
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
  };

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

  useEffect(() => {
    fetchFeedItems();
    fetchRegisteredEvents();
  }, []);

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
      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (response.ok) {
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
      } else {
        console.error("Failed to register for event");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    }
    handleCloseModal();
  };

  const isRegistered = (eventId) => registeredEvents.includes(eventId);

  const renderFeedItem = (item) => {
    if (item.type === "event") {
      const eventIsRegistered =
        isRegistered(item.event_id) || item.isRegistered;
      return (
        <div
          key={item.event_id}
          className="w-[90%] bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3 text-[#0B6EC9]">
            {item.title}
          </h2>
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
              <img
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
        className="newsfeed absolute 2xl:w-[55%] 2xl:h-[85%] 2xl:translate-x-[41%] 2xl:translate-y-[13%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%] overflow-y-auto bg-[#dfecf6]"
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
        <h1 className="text-3xl font-bold mb-6 text-[#0B6EC9]">Student Feed</h1>
        {feedItems.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FaCalendarAlt className="text-6xl text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No items to display yet.</p>
            <p className="text-gray-500">Check back later for updates!</p>
          </div>
        ) : (
          feedItems.map(renderFeedItem)
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
