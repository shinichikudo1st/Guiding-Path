import { useState, useEffect } from "react";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaLink,
  FaCalendar,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ViewAnnouncementModal = ({ announcement, closeModal, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [announcementData, setAnnouncementData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (announcement) {
      setAnnouncementData(announcement);
      setIsLoading(false);
    }
  }, [announcement]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/announcementOption?id=${announcementData.resource_id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onUpdate();
        closeModal("Announcement deleted successfully");
      } else {
        closeModal("Failed to delete announcement", true);
      }
    } catch (error) {
      closeModal("An error occurred while deleting the announcement", true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("resource_id", announcementData.resource_id);
      formData.append("title", announcementData.title);
      formData.append("description", announcementData.description);
      formData.append("link", announcementData.link || "");
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch("/api/announcementOption", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const updatedAnnouncement = await response.json();
        setAnnouncementData(updatedAnnouncement.announcement);
        onUpdate();
        closeModal("Announcement updated successfully");
      } else {
        closeModal("Failed to update announcement", true);
      }
    } catch (error) {
      closeModal("An error occurred while updating the announcement", true);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#0B6EC9] border-t-transparent rounded-full"
          />
          <p className="mt-4 text-[#062341] font-medium">
            Loading announcement...
          </p>
        </motion.div>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Announcement" : "View Announcement"}
            </h2>
            <button
              onClick={closeModal}
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
                  value={announcementData.title}
                  onChange={(e) =>
                    setAnnouncementData({
                      ...announcementData,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Description
                </label>
                <textarea
                  value={announcementData.description}
                  onChange={(e) =>
                    setAnnouncementData({
                      ...announcementData,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Related Link
                </label>
                <input
                  type="text"
                  value={announcementData.link || ""}
                  onChange={(e) =>
                    setAnnouncementData({
                      ...announcementData,
                      link: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                  placeholder="https://"
                />
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
                    ) : announcementData.img_path ? (
                      <img
                        src={announcementData.img_path}
                        alt="Current"
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
                {announcementData.title}
              </h3>
              <p className="text-[#062341]/70 whitespace-pre-wrap">
                {announcementData.description}
              </p>
              {announcementData.img_path && (
                <img
                  src={announcementData.img_path}
                  alt="Announcement"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              )}
              {announcementData.link && (
                <a
                  href={announcementData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#0B6EC9] hover:text-[#095396] group"
                >
                  <FaLink className="mr-2 transition-transform group-hover:scale-110" />
                  Related Link
                </a>
              )}
              <div className="flex items-center text-sm text-[#062341]/70 space-x-4">
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    {new Date(announcementData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>
                    {new Date(announcementData.createdAt).toLocaleTimeString()}
                  </span>
                </div>
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
                onClick={handleSave}
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
              <div className="flex gap-3">
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
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewAnnouncementModal;
