import { useEffect, useState } from "react";
import PaginationButton from "../../UI/paginationButton";
import Image from "next/image";
import ManageRequest from "./manageRequest";
import { AiOutlineCalendar, AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUserGraduate, FaEnvelope, FaClipboardList } from "react-icons/fa";

const ShowAppointmentRequest = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [manageRequest, setManageRequests] = useState(false);
  const [request_id, setRequest_id] = useState(null);

  const handleManageRequest = (id) => {
    setRequest_id(id);

    setManageRequests(true);
  };

  const closeButton = () => {
    setManageRequests(false);
  };

  const initialRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getRequests?page=${currentPage}`);
      const data = await response.json();
      setRequests(data.requests);
      setTotalPages(data.totalPages);
      console.log(data.message);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    initialRequests();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {manageRequest && (
        <ManageRequest
          closeButton={closeButton}
          requests={requests}
          requestID={request_id}
          initialRequests={initialRequests}
        />
      )}
      <div className="absolute mt-[10%] w-[80%] h-[60%] bg-[#D8E8F6] shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 py-2 text-lg font-medium text-blue-600 bg-blue-100 rounded-full animate-pulse flex items-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Loading Requests...
            </div>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4 p-4">
            {requests.map((request) => (
              <div
                key={request.request_id}
                className="flex items-center p-4 bg-[#F0F7FF] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image
                    priority
                    alt="profile picture"
                    src={request.student.student.profilePicture}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FaUserGraduate className="mr-2 text-blue-500" />
                    {request.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mt-1 flex items-center">
                    <AiOutlineCalendar className="mr-1 text-blue-500" />
                    Requested for: {request.request_date}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <button
                    onClick={() => handleManageRequest(request.request_id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-150 shadow-md hover:shadow-lg"
                  >
                    <FaClipboardList className="mr-2" />
                    Manage Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-xl font-semibold text-gray-600">
                No appointment requests
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later for new requests
              </p>
            </div>
          </div>
        )}
      </div>

      <PaginationButton
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />
    </>
  );
};

export default ShowAppointmentRequest;
