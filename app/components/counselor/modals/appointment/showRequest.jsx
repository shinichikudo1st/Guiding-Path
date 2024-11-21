import { useEffect, useState } from "react";
import Image from "next/image";
import ManageRequest from "./manageRequest";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaUserGraduate, FaClipboardList, FaSpinner } from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { motion } from "framer-motion";

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
      <div className="bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
        <div className="min-h-[60vh] flex flex-col justify-between">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <FaSpinner className="animate-spin text-4xl text-[#0B6EC9]" />
              <p className="ml-2 text-lg text-[#0B6EC9] font-semibold">
                Loading Requests...
              </p>
            </div>
          ) : (
            <>
              <div className="flex-grow">
                {requests.length > 0 ? (
                  <div className="space-y-4 p-6">
                    {requests.map((request) => (
                      <motion.div
                        key={request.request_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/5 max-w-4xl mx-auto"
                      >
                        <div className="flex-shrink-0">
                          <Image
                            priority
                            alt="profile picture"
                            src={request.student.student.profilePicture}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-[#0B6EC9]"
                          />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                          <h3 className="text-base font-semibold text-[#062341] flex items-center justify-center sm:justify-start gap-2">
                            <FaUserGraduate className="text-[#0B6EC9] text-sm" />
                            {request.name}
                          </h3>
                          <p className="text-xs font-medium text-[#062341]/70 mt-1 flex items-center justify-center sm:justify-start gap-2">
                            <AiOutlineCalendar className="text-[#0B6EC9] text-sm" />
                            Requested for: {request.request_date}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleManageRequest(request.request_id)
                            }
                            className="w-full sm:w-auto px-4 py-1.5 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-full font-medium text-sm hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md flex items-center justify-center gap-1.5"
                          >
                            <FaClipboardList className="text-sm" />
                            Manage Request
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[50vh]">
                    <div className="text-center">
                      <FaClipboardList className="mx-auto text-4xl text-[#0B6EC9]/40 mb-2" />
                      <p className="text-xl font-semibold text-[#062341]">
                        No appointment requests
                      </p>
                      <p className="text-sm text-[#062341]/70 mt-2">
                        Check back later for new requests
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border-t border-[#0B6EC9]/10 p-3 mt-auto">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#062341]/70">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                    >
                      <IoChevronBackOutline className="w-4 h-4 text-[#062341]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-[#0B6EC9]/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-colors"
                    >
                      <IoChevronForwardOutline className="w-4 h-4 text-[#062341]" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowAppointmentRequest;
