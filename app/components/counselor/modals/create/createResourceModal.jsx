import { useState } from "react";
import { FaTimes, FaImage, FaLink, FaUpload } from "react-icons/fa";
import { motion } from "framer-motion";

const ResourceModal = ({ closeButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [link, setLink] = useState("");
  const [internalError, setInternalError] = useState("");

  const validateForm = () => {
    setInternalError("");
    if (!title.trim()) {
      setInternalError("Title is required");
      return false;
    }
    if (!content.trim()) {
      setInternalError("Content is required");
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
      formData.append("content", content);
      formData.append("link", link);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/createResource", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        closeButton("Resource created successfully");
      } else {
        const data = await response.json();
        setInternalError(data.message || "Failed to create resource");
      }
    } catch (error) {
      setInternalError("An error occurred while creating the resource");
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
        {internalError && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm">{internalError}</p>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              Create New Resource
            </h2>
            <button
              onClick={() => closeButton()}
              className="text-white/80 hover:text-white transition duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

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
                placeholder="Enter resource title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#062341] mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4"
                className="w-full p-2.5 border border-[#0B6EC9]/20 rounded-lg focus:ring-2 focus:ring-[#0B6EC9]/20 focus:border-[#0B6EC9] transition-all duration-300"
                required
                placeholder="Enter resource content"
              />
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
              {isLoading ? "Creating..." : "Create Resource"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResourceModal;
