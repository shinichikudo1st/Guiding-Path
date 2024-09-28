import { useState, useEffect } from "react";

const ViewEventModal = ({ event, closeButton, onEventChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [dateTime, setDateTime] = useState(event.date_time);
  const [location, setLocation] = useState(event.location);
  const [link, setLink] = useState(event.link);

  useEffect(() => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDateTime(event.date_time);
    setLocation(event.location);
    setLink(event.link);
  }, [event]);

  const handleEdit = async () => {
    const response = await fetch(`/api/eventOption`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: currentEvent.event_id,
        title,
        description,
        date_time: dateTime,
        location,
        link,
      }),
    });

    if (response.ok) {
      setIsEditing(false);
      const updatedEvent = {
        ...currentEvent,
        title,
        description,
        date_time: dateTime,
        location,
        link,
      };
      setCurrentEvent(updatedEvent);
      if (typeof onEventChange === "function") {
        onEventChange(updatedEvent);
      }
    } else {
      alert("Failed to update event");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(
      `/api/eventOption?id=${currentEvent.event_id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      if (typeof onEventChange === "function") {
        onEventChange(null);
      }
      closeButton();
    } else {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-80 h-screen w-screen translate-x-[-22.55%] translate-y-[-16%]"></div>
      <div className="relative bg-white w-full max-w-4xl mx-auto p-16 rounded-lg shadow-2xl z-50">
        <button
          onClick={closeButton}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-4xl font-semibold mb-8 text-center text-[#0B6EC9]">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-center"
            />
          ) : (
            currentEvent.title
          )}
        </h2>
        <div className="space-y-8">
          <p className="text-xl text-[#818487]">
            <strong>Description:</strong>{" "}
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            ) : (
              currentEvent.description
            )}
          </p>
          <p className="text-xl text-[#818487]">
            <strong>Date & Time:</strong>{" "}
            {isEditing ? (
              <input
                type="datetime-local"
                value={new Date(dateTime).toISOString().slice(0, 16)}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full"
              />
            ) : (
              new Date(currentEvent.date_time).toLocaleString()
            )}
          </p>
          <p className="text-xl text-[#818487]">
            <strong>Location:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            ) : (
              currentEvent.location
            )}
          </p>
          {currentEvent.link && (
            <p className="text-xl text-[#818487]">
              <strong>Link:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full"
                />
              ) : (
                <a
                  href={currentEvent.link}
                  className="text-blue-500 hover:underline"
                >
                  {currentEvent.link}
                </a>
              )}
            </p>
          )}
        </div>
        <div className="flex justify-end mt-8 space-x-4">
          {isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-[#0B6EC9] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#062341] transition-colors duration-300"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#0B6EC9] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#062341] transition-colors duration-300"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
