import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash, FaUpload } from "react-icons/fa";

const ViewAnnouncementModal = ({ announcement, closeModal, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [announcementData, setAnnouncementData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (announcement) {
      setAnnouncementData(announcement);
      setIsLoading(false);
    }
  }, [announcement]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const response = await fetch(
          `/api/announcementOption?id=${announcementData.resource_id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          onUpdate();
          closeModal();
        } else {
          console.error("Failed to delete announcement");
        }
      } catch (error) {
        console.error("Error deleting announcement:", error);
      }
    }
  };

  const handleSave = async () => {
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
        setIsEditing(false);
        setNewImage(null);
        setPreviewImage(null);
        onUpdate();
        closeModal(); // Close the modal after saving
      } else {
        console.error("Failed to update announcement");
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
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
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
      <div className="absolute inset-0 bg-black opacity-[0.8] h-screen w-screen translate-x-[-22.55%] translate-y-[-16%] z-30"></div>
      <div className="bg-white p-8 rounded-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto translate-y-[-5%] z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0B6EC9]">
            {isEditing ? "Edit Announcement" : "View Announcement"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <input
                type="text"
                value={announcementData.title}
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <textarea
                value={announcementData.description}
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={announcementData.link || ""}
                onChange={(e) =>
                  setAnnouncementData({
                    ...announcementData,
                    link: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="Related Link"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Image
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
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
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </span>
                  <label
                    htmlFor="file-upload"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold">
                {announcementData.title}
              </h3>
              <p className="text-gray-600">{announcementData.description}</p>
              {announcementData.img_path && (
                <img
                  src={announcementData.img_path}
                  alt="Announcement Image"
                  className="w-full h-auto rounded-lg"
                />
              )}
              {announcementData.link && (
                <a
                  href={announcementData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Related Link
                </a>
              )}
              <p className="text-sm text-gray-500">
                Posted on:{" "}
                {new Date(announcementData.createdAt).toLocaleString()}
              </p>
            </>
          )}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <FaUpload size={18} className="mr-2" />
              Save
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
              title="Edit Announcement"
            >
              <FaEdit size={18} className="mr-2" />
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
            title="Delete Announcement"
          >
            <FaTrash size={18} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncementModal;
