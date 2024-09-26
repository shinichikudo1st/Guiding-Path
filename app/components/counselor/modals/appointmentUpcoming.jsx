import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillBook, AiFillEye } from "react-icons/ai";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import UpcomingAppointmentSingle from "./upcomingAppointmentSingle";
import RescheduleAppointment from "./rescheduleModal";

const ShowAppointmentUpcoming = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [singleAppointment, setSingleAppointment] = useState(null);
  const [viewAppointment, setViewAppointment] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);

  const specificAppointment = (id) => {
    const specific = appointments.find(
      (appointment) => appointment.appointment_id === id
    );
    setSingleAppointment(specific);
    setViewAppointment(true);
  };

  const openRescheduleModal = (id) => {
    setRescheduleAppointmentId(id);
  };

  const closeRescheduleModal = () => {
    setRescheduleAppointmentId(null);
  };

  const handleRescheduleSuccess = () => {
    getAppointments(); // Fetch appointments again after successful reschedule
    setRescheduleAppointmentId(null); // Close the reschedule modal
  };

  const getAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/getAppointments?type=${"upcoming"}&page=${currentPage}`
      );
      const result = await response.json();
      setAppointments(result.appointments);
      setTotalPages(result.totalPages);
      console.log(result.totalPages);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
    setLoading(false);
  };

  const closeButton = () => {
    setViewAppointment(false);
    setSingleAppointment(null);
  };

  useEffect(() => {
    getAppointments();
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
      {viewAppointment && (
        <UpcomingAppointmentSingle
          closeButton={closeButton}
          appointment={singleAppointment}
        />
      )}
      {rescheduleAppointmentId && (
        <RescheduleAppointment
          appointmentId={rescheduleAppointmentId}
          onClose={closeRescheduleModal}
          onSuccess={handleRescheduleSuccess}
        />
      )}
      <div className="absolute mt-[10%] w-[80%] h-[70%] bg-[#D8E8F6] shadow-lg rounded-lg border border-gray-200 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 py-2 text-lg font-medium text-blue-600 bg-blue-100 rounded-full animate-pulse">
              Loading Appointments...
            </div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4 p-4 overflow-auto h-full">
            {appointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-[#F0F7FF] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image
                    alt="Profile Picture"
                    src={appointment.student.student.profilePicture}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {appointment.student.student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.student.student.email}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    {appointment.date_time}
                  </p>
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() =>
                        specificAppointment(appointment.appointment_id)
                      }
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-150"
                    >
                      <AiFillEye className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        openRescheduleModal(appointment.appointment_id)
                      }
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-150"
                    >
                      <AiFillBook className="mr-1" />
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-600">
                No upcoming appointments
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later or schedule new appointments
              </p>
            </div>
          </div>
        )}

        {/* New Pagination UI */}
        <div className="mt-auto p-4 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span>
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
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
};

export default ShowAppointmentUpcoming;
