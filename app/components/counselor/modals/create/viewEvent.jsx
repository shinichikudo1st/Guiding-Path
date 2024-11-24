import { useState, useEffect } from "react";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaLink,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [department, setDepartment] = useState(event.forDepartment);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [internalError, setInternalError] = useState("");

  useEffect(() => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDateTime(event.date_time);
    setLocation(event.location);
    setLink(event.link);
    setPreviewImage(event.img_path);
    setDepartment(event.forDepartment);
  }, [event]);

  const validateForm = () => {
    setInternalError("");
    const eventDate = new Date(dateTime);
    const now = new Date();

    if (eventDate < now) {
      setInternalError("Cannot select a past date");
      return false;
    }
    if (!title.trim()) {
      setInternalError("Title is required");
      return false;
    }
    if (!description.trim()) {
      setInternalError("Description is required");
      return false;
    }
    if (!dateTime) {
      setInternalError("Date and time is required");
      return false;
    }
    if (!location.trim()) {
      setInternalError("Location is required");
      return false;
    }
    return true;
  };

  const handleEdit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("event_id", currentEvent.event_id);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date_time", new Date(dateTime).toISOString());
      formData.append("location", location);
      formData.append("link", link);
      formData.append("forDepartment", department);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(`/api/eventOption`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setCurrentEvent(updatedEvent);
        setPreviewImage(updatedEvent.img_path);
        onEventChange();
        closeButton("Event updated successfully");
      } else {
        const data = await response.json();
        setInternalError(data.message || "Failed to update event");
      }
    } catch (error) {
      setInternalError("An error occurred while updating the event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/eventOption?id=${currentEvent.event_id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onEventChange();
        closeButton("Event deleted successfully");
      } else {
        closeButton("Failed to delete event", true);
      }
    } catch (error) {
      closeButton("An error occurred while deleting the event", true);
    } finally {
      setIsDeleting(false);
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
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-xl"
      >
        {/* Add error message display */}
        {internalError && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{internalError}</p>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Event" : "View Event"}
            </h2>
            <button
              onClick={closeButton}
              className="text-white/80 hover:text-white transition duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={new Date(dateTime).toISOString().slice(0, 16)}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Related Link
                </label>
                <input
                  type="text"
                  value={link || ""}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Department Access
                </label>
                <select
                  value={department || ""}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                >
                  <option value="">All Departments</option>
                  <option value="College of Education">
                    College of Education
                  </option>
                  <option value="College of Technology">
                    College of Technology
                  </option>
                  <option value="College of Engineering">
                    College of Engineering
                  </option>
                  <option value="College of Arts and Sciences">
                    College of Arts and Sciences
                  </option>
                  <option value="College of Management">
                    College of Management and Entrepreneurship
                  </option>
                  <option value="College of CCICT">
                    College of Computer Information and Communications
                    Technology
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-2">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-50 border border-[#0B6EC9]/20">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-50">
                        <FaUpload className="text-gray-400 text-xl" />
                      </div>
                    )}
                  </div>
                  <label className="flex items-center px-4 py-2 bg-white text-[#062341] rounded-lg border border-[#0B6EC9]/20 hover:bg-gray-50 cursor-pointer transition-all duration-300">
                    <FaUpload className="mr-2" />
                    Upload Image
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-[#062341]">
                {currentEvent.title}
              </h3>
              <p className="text-[#062341]/70 whitespace-pre-wrap">
                {currentEvent.description}
              </p>

              <div className="flex flex-wrap items-center text-sm text-[#062341]/70 gap-4">
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    {new Date(currentEvent.date_time).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>
                    {new Date(currentEvent.date_time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{currentEvent.location}</span>
                </div>
              </div>

              {currentEvent.link && (
                <a
                  href={currentEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#0B6EC9] hover:text-[#095396] group"
                >
                  <FaLink className="mr-2 transition-transform group-hover:scale-110" />
                  Related Link
                </a>
              )}

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Event"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}

              <div className="mt-4 p-3 bg-[#0B6EC9]/5 rounded-lg">
                <p className="text-sm text-[#062341]/70">
                  <span className="font-medium">Department Access:</span>{" "}
                  {currentEvent.forDepartment || "All Departments"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#0B6EC9]/10 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg hover:from-[#095396] hover:to-[#084B87] transition-all duration-300"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-2" />
                      Delete
                    </>
                  )}
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewEventModal;
