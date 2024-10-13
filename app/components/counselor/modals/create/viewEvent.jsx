import { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";

const ViewEventModal = ({ event, closeButton, onEventChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [dateTime, setDateTime] = useState(event.date_time);
  const [location, setLocation] = useState(event.location);
  const [link, setLink] = useState(event.link);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(event.img_path);

  useEffect(() => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDateTime(event.date_time);
    setLocation(event.location);
    setLink(event.link);
    setPreviewImage(event.img_path);
  }, [event]);

  const handleEdit = async () => {
    const formData = new FormData();
    formData.append("event_id", currentEvent.event_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date_time", dateTime);
    formData.append("location", location);
    formData.append("link", link);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const response = await fetch(`/api/eventOption`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      setIsEditing(false);
      const updatedEvent = await response.json();
      setCurrentEvent(updatedEvent);
      setPreviewImage(updatedEvent.img_path);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
          <div>
            <label
              htmlFor="image"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Event"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaImage className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                )}
              </label>
            </div>
          </div>
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
