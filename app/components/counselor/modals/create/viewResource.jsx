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

const ViewResourceModal = ({ resource, closeModal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resourceData, setResourceData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [internalError, setInternalError] = useState("");

  useEffect(() => {
    if (resource) {
      setResourceData(resource);
      setIsLoading(false);
    }
  }, [resource]);

  const validateForm = () => {
    setInternalError("");
    if (!resourceData.title.trim()) {
      setInternalError("Title is required");
      return false;
    }
    if (!resourceData.description.trim()) {
      setInternalError("Description is required");
      return false;
    }
    return true;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setInternalError("");

    try {
      const response = await fetch(
        `/api/resourceOption?id=${resourceData.resource_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        closeModal("Resource deleted successfully");
      } else {
        const data = await response.json();
        setInternalError(data.message || "Failed to delete resource");
      }
    } catch (error) {
      setInternalError("An error occurred while deleting the resource");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setInternalError("");
    try {
      const formData = new FormData();
      formData.append("resource_id", resourceData.resource_id);
      formData.append("title", resourceData.title);
      formData.append("description", resourceData.description);
      formData.append("link", resourceData.link || "");
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch("/api/resourceOption", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const updatedResource = await response.json();
        setResourceData(updatedResource.resource);
        closeModal("Resource updated successfully");
      } else {
        const data = await response.json();
        setInternalError(data.message || "Failed to update resource");
      }
    } catch (error) {
      setInternalError("An error occurred while updating the resource");
    } finally {
      setIsSaving(false);
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
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-[95%] max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {internalError && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{internalError}</p>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Resource" : "View Resource"}
            </h2>
            <button
              onClick={closeModal}
              className="text-white/80 hover:text-white transition duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={resourceData.title}
                    onChange={(e) =>
                      setResourceData({
                        ...resourceData,
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
                    value={resourceData.description}
                    onChange={(e) =>
                      setResourceData({
                        ...resourceData,
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
                    value={resourceData.link || ""}
                    onChange={(e) =>
                      setResourceData({ ...resourceData, link: e.target.value })
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
                      ) : resourceData.img_path ? (
                        <img
                          src={resourceData.img_path}
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
                  {resourceData.title}
                </h3>
                <p className="text-[#062341]/70 whitespace-pre-wrap">
                  {resourceData.description}
                </p>

                <div className="flex items-center text-sm text-[#062341]/70 space-x-4">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>
                      {new Date(resourceData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>
                      {new Date(resourceData.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {resourceData.link && (
                  <a
                    href={resourceData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#0B6EC9] hover:text-[#095396] group"
                  >
                    <FaLink className="mr-2 transition-transform group-hover:scale-110" />
                    Resource Link
                  </a>
                )}

                {resourceData.img_path && (
                  <img
                    src={resourceData.img_path}
                    alt="Resource"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
          </div>
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

export default ViewResourceModal;
