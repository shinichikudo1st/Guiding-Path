import { useState, useEffect } from "react";
import PaginationButton from "../../UI/paginationButton";
import AnnouncementModal from "./createAnnouncementModal";
import ViewAnnouncementModal from "./viewAnnouncement";
import { FaCalendar, FaClock, FaLink } from "react-icons/fa";

const CreateAnnouncement = () => {
  const [createModal, setCreateModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getAnnouncements?page=${currentPage}`);
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(data.announcements);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch announcements:", data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [currentPage, refreshKey]);

  const handleCreateModalClose = () => {
    setCreateModal(false);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setViewModal(true);
  };

  const handleViewModalClose = () => {
    setViewModal(false);
    setSelectedAnnouncement(null);
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <>
      {createModal && (
        <AnnouncementModal closeButton={handleCreateModalClose} />
      )}
      {viewModal && selectedAnnouncement && (
        <ViewAnnouncementModal
          announcement={selectedAnnouncement}
          closeModal={handleViewModalClose}
          onUpdate={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      )}
      <div className="announcementBox absolute mt-[10%] w-[80%] h-[60%] bg-[#dfecf6] border-[1px] border-[#062341] overflow-y-auto p-6 rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#E6F0F9]">
        {isLoading ? (
          <p className="text-center text-[#818487]">Loading announcements...</p>
        ) : announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.resource_id}
              className="p-6 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleViewAnnouncement(announcement)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-[#0B6EC9]">
                  {announcement.title}
                </h3>
                <div className="flex items-center text-[#818487]">
                  <FaCalendar className="mr-2" />
                  <span>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                  <FaClock className="ml-4 mr-2" />
                  <span>
                    {new Date(announcement.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              {announcement.link && (
                <a
                  href={announcement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#0B6EC9] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaLink className="mr-2" />
                  Related Link
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-[#818487]">
            <p>No announcements found.</p>
            <p>Click the + button to create a new announcement.</p>
          </div>
        )}
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

export default CreateAnnouncement;
