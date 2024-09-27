import { useState } from "react";
import { FaTimes, FaImage, FaLink } from "react-icons/fa";

const AnnouncementModal = ({ closeButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("link", link);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/createAnnouncement", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        closeButton();
      } else {
        console.error("Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
      <div className="absolute inset-0 bg-black opacity-[0.8] h-screen w-screen translate-x-[-22.55%] translate-y-[-16%] z-30"></div>
      <div className="bg-white p-8 rounded-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto translate-y-[-5%] z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0B6EC9]">
            Create New Announcement
          </h2>
          <button
            onClick={closeButton}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-300"
              required
              placeholder="Enter announcement title"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-40 focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-300"
              required
              placeholder="Enter announcement content"
            />
          </div>
          <div>
            <label
              htmlFor="link"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Link (optional)
            </label>
            <div className="relative">
              <input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B6EC9] focus:border-transparent transition duration-300"
                placeholder="Enter optional link"
              />
              <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Image (optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300"
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
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
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeButton}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#0B6EC9] text-white rounded-md hover:bg-[#095396] transition duration-300 disabled:bg-[#0B6EC9]/50"
            >
              {isLoading ? "Creating..." : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
