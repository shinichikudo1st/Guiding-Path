import { useState, useEffect } from "react";
import PaginationButton from "../../UI/paginationButton";
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

  const fetchEvents = async () => {
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
      <div className="eventBox absolute mt-[10%] w-[80%] h-[60%] bg-[#dfecf6] border-[1px] border-[#062341] overflow-y-auto p-6 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#E6F0F9]">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <h3 className="text-2xl font-semibold text-[#0B6EC9] mb-2">
              {event.title}
            </h3>
            <p className="text-[#818487]">
              {new Date(event.date_time).toLocaleString()}
            </p>
          </div>
        ))}
        <button
          onClick={() => setCreateModal(true)}
          className="absolute bg-[#0B6EC9] w-[60px] h-[60px] rounded-full text-[30pt] text-[#E6F0F9] font-bold bottom-4 right-4 flex items-center justify-center shadow-md hover:bg-[#062341] transition-colors duration-300"
        >
          +
        </button>
      </div>
      <PaginationButton
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default CreateEvent;
