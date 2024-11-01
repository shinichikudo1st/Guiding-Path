import { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaUserGraduate,
  FaEnvelope,
  FaClipboardList,
  FaUserMd,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const TeacherAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getReferredAppointments?page=${currentPage}`
      );
      const data = await response.json();
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
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

  const formatDate = (dateString, format = "long") => {
    const date = new Date(dateString);
    if (format === "short") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <>
      <div className="absolute bg-[#dfecf6] xl:w-[55%] xl:h-[80%] xl:translate-x-[41%] xl:translate-y-[20%] 2xl:translate-y-[16%] rounded-[20px] flex flex-col items-center px-[4%] pt-[3%] gap-[5%]">
        <h2 className="text-3xl font-bold text-[#062341] mb-6">
          Referred Appointments
        </h2>
        <div className="fixThese w-full h-[80%] bg-gradient-to-br from-[#F0F8FF] to-[#E6F0F9] rounded-lg shadow-2xl overflow-hidden p-6 flex flex-col">
          <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#dfecf6]">
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="px-4 py-2 text-lg font-medium text-blue-600 bg-blue-100 rounded-full animate-pulse flex items-center">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Loading Appointments...
                </div>
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center p-4 bg-[#F9FAFB] rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-shrink-0 mr-4">
                        <Image
                          priority
                          alt="student profile picture"
                          src={appointment.student.student.profilePicture}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-blue-500 xl:w-[40px] xl:h-[40px] 2xl:w-[64px] 2xl:h-[64px]"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-[8pt] 2xl:text-lg font-semibold text-gray-900 flex items-center">
                          <FaUserGraduate className="mr-2 text-blue-500" />
                          {appointment.student.student.name}
                        </h3>
                        <p className="text-[8pt] 2xl:text-sm font-medium text-gray-600 mt-1 flex items-center">
                          <FaEnvelope className="mr-1 text-blue-500" />
                          {appointment.student.student.email}
                        </p>
                        <p className="text-[8pt] 2xl:text-xs font-medium mt-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Student
                        </p>
                      </div>
                      <div className="flex-grow-0 mx-4 border-dotted border-r-2 border-gray-300 h-16"></div>
                      <div className="flex-shrink-0 mr-4">
                        <Image
                          priority
                          alt="counselor profile picture"
                          src={appointment.counselor.counselor.profilePicture}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-blue-500 xl:w-[40px] xl:h-[40px] 2xl:w-[64px] 2xl:h-[64px]"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-[8pt] 2xl:text-lg font-semibold text-gray-900 flex items-center">
                          <FaUserMd className="mr-2 text-blue-500" />
                          {appointment.counselor.counselor.name}
                        </h3>
                        <p className="text-[8pt] 2xl:text-sm font-medium text-gray-600 mt-1 flex items-center">
                          <FaEnvelope className="mr-1 text-blue-500" />
                          {appointment.counselor.counselor.email}
                        </p>
                        <p className="text-[8pt] 2xl:text-xs font-medium mt-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Counselor
                        </p>
                      </div>
                      <div className="flex-grow-0 mx-4 border-dotted border-r-2 border-gray-300 h-16"></div>
                      <div className="flex-shrink-0">
                        <p className="xl:text-[6pt] 2xl:text-sm font-medium text-gray-600 mt-1 flex items-center">
                          <FaCalendarAlt className="mr-1 text-blue-500" />
                          <span className="xl:hidden 2xl:inline">
                            {formatDate(appointment.date_time, "long")}
                          </span>
                          <span className="hidden xl:inline 2xl:hidden">
                            {formatDate(appointment.date_time, "short")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                  <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-xl font-semibold text-gray-600">
                    No referred appointments
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Check back later for new appointments
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination UI */}
          <div className="mt-4 p-4 flex items-center justify-between border-t border-gray-200 bg-[#F9FAFB] rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-[#F9FAFB] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-[#F9FAFB] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-[#F9FAFB] text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <IoChevronBackOutline
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-[#F9FAFB] text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <IoChevronForwardOutline
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherAppointment;
