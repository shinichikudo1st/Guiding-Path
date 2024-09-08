import { useEffect, useState } from "react";
import PaginationButton from "../../UI/paginationButton";
import Image from "next/image";
import ManageRequest from "./manageRequest";

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
      <div className="absolute mt-[10%] w-[80%] h-[60%] bg-[#D8E8F6] border-[1px] border-[#062341]">
        {loading ? (
          <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
              Loading Requests...
            </div>
          </div>
        ) : (
          requests &&
          requests.map((request) => (
            <div
              key={request.request_id}
              className="h-[20%] w-[100%] border-b-[1px] border-[#062341] flex"
            >
              <div className="flex justify-center items-center w-[25%] h-[100%]">
                <Image
                  priority
                  alt="profile picture"
                  src={request.student.student.profilePicture}
                  width={70}
                  height={70}
                  className="rounded-[999px]"
                />
              </div>
              <span className="flex items-center w-[25%] text-[10pt] font-bold text-center">
                {request.name}
              </span>
              <span className="flex justify-center items-center w-[25%] text-[10pt] text-[#0B6EC9] font-medium">
                {request.request_date}
              </span>
              <div className="flex justify-center items-center w-[25%] h-[100%]">
                <button
                  onClick={() => handleManageRequest(request.request_id)}
                  className="text-white bg-[#63a7e4] hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Manage
                </button>
              </div>
            </div>
          ))
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
