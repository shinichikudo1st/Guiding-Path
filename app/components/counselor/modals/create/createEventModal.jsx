import { useState } from "react";
import {
  FaTimes,
  FaImage,
  FaLink,
  FaUpload,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const EventModal = ({ closeButton }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forDepartment, setForDepartment] = useState("");
  const [limit, setLimit] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const eventDate = new Date(dateTime);
    const now = new Date();

    if (eventDate < now) {
      setErrorMessage("Cannot select a past date");
      return false;
    }
    if (!title.trim()) {
      setErrorMessage("Title is required");
      return false;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required");
      return false;
    }
    if (!dateTime) {
      setErrorMessage("Date and time is required");
      return false;
    }
    if (!location.trim()) {
      setErrorMessage("Location is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date_time", dateTime);
      formData.append("location", location);
      formData.append("link", link);
      formData.append("forDepartment", forDepartment);
      formData.append("grade_level", gradeLevel);
      if (limit) formData.append("limit", limit);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/createEvent", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        closeButton("Event created successfully");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to create event");
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the event");
    } finally {
      setIsLoading(false);
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
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Create New Event</h2>
            <button
              onClick={() => closeButton()}
              className="text-white/80 hover:text-white transition duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        {(errorMessage || successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-center font-medium ${
              errorMessage
                ? "bg-red-100 text-red-600 border border-red-200"
                : "bg-green-100 text-green-600 border border-green-200"
            }`}
          >
            {errorMessage || successMessage}
          </motion.div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[calc(80vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#0B6EC9]/60 scrollbar-track-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#062341] mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                required
                placeholder="Enter event title"
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
                required
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 pl-10 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                    required
                    placeholder="Enter event location"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0B6EC9]/40" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#062341] mb-1">
                Related Link (optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2.5 pl-10 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                  placeholder="https://"
                />
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0B6EC9]/40" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[#062341] text-sm font-medium mb-2">
                Department (Optional)
              </label>
              <select
                value={forDepartment}
                onChange={(e) => setForDepartment(e.target.value)}
                className="w-full p-3 border border-[#0B6EC9]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
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
                  <option value="College of Management and Entrepreneurship">
                    College of Management and Entrepreneurship
                  </option>
                  <option value="College of Computer Information and Communications Technology">
                    College of Computer Information and Communications
                    Technology
                  </option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[#062341] text-sm font-medium mb-2">
                Grade Level (Optional)
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full p-3 border border-[#0B6EC9]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
              >
                <option value="">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[#062341] text-sm font-medium mb-2">
                Number of Attendees (Optional)
              </label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                min="0"
                placeholder="Leave empty for no limit"
                className="w-full p-3 border border-[#0B6EC9]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#062341] mb-2">
                Image (optional)
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
                      <FaImage className="text-[#0B6EC9]/40 text-xl" />
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
              <p className="mt-2 text-xs text-[#062341]/60">
                Supported formats: PNG, JPG or GIF (Max: 800x400px)
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#0B6EC9]/10 p-6 bg-gray-50">
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => closeButton()}
              className="px-4 py-2 bg-white text-[#062341] rounded-lg border border-[#0B6EC9]/20 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-lg hover:from-[#095396] hover:to-[#084B87] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? "Creating..." : "Create Event"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventModal;
