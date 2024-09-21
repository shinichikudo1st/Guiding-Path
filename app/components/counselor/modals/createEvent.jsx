import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import EventModal from "./createEventModal";
import ViewEventModal from "./viewEvent";

const CreateEvent = () => {
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getEvents?page=${currentPage}`);
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch events:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, refreshKey]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setViewModal(true);
  };

  const handleCreateModalClose = () => {
    setCreateModal(false);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleEventChange = () => {
    setRefreshKey((oldKey) => oldKey + 1);
    setViewModal(false);
  };

  return (
    <>
      {createModal && <EventModal closeButton={handleCreateModalClose} />}
      {viewModal && (
        <ViewEventModal
          event={selectedEvent}
          closeButton={() => setViewModal(false)}
          onEventChange={handleEventChange}
        />
      )}
      <div className="absolute mt-[10%] w-[80%] h-[70%] bg-[#F0F7FF] shadow-lg rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="space-y-4 p-4 overflow-auto h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
              <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
                Loading events...
              </p>
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date_time).toLocaleString()}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleEventClick(event)}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
                  >
                    <AiFillEye className="mr-1" />
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg text-gray-500">No events found.</p>
            </div>
          )}
        </div>

        {/* New Create Event button */}
        <button
          onClick={() => setCreateModal(true)}
          className="fixed bottom-8 right-8 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0B6EC9] text-white shadow-lg hover:bg-[#095396] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B6EC9] transition-all duration-300 transform hover:scale-110"
          title="Create New Event"
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

        {/* New Pagination UI */}
        <div className="mt-auto p-4 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="flex-1 flex items-center justify-between">
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

export default CreateEvent;
