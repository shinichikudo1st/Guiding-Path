import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillBook } from "react-icons/ai";
import PaginationButton from "../../UI/paginationButton";

const ShowAppointmentUpcoming = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAppointments = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/getAppointments?type=${"upcoming"}&page=${currentPage}`
      );
      const result = await response.json();

      setAppointments(result.appointments);
      setTotalPages(data.totalPages);
    } catch (error) {}
    setLoading(false);
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
      <div className="absolute mt-[10%] w-[80%] h-[60%] bg-[#D8E8F6] border-[1px] border-[#062341] overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#A8B9C9]">
        {loading ? (
          <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
              Loading Requests...
            </div>
          </div>
        ) : (
          appointments &&
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="w-[100%] h-[33.3%] bg-blue-200 flex items-center border-y-[1px] border-[#062341]"
            >
              <div className="w-[15%] flex justify-center items-center h-[100%] ">
                <Image
                  alt="profilePicture"
                  src={appointment.student.student.profilePicture}
                  width={100}
                  height={100}
                  className="rounded-[999px] border-[1px] border-[#062341]"
                />
              </div>
              <div className="flex flex-col justify-center items-center w-[30%] h-[100%]">
                <span className="font-semibold">
                  {appointment.student.student.name}
                </span>
                <span className="text-[10pt] text-[#858C92]">
                  {appointment.student.student.email}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center w-[20%] h-[100%]">
                <span className="font-bold text-[10pt] text-[#F75555]">
                  {appointment.date_time}
                </span>
              </div>
              <div className="flex justify-evenly items-center w-[35%] h-[100%]">
                <div className="cursor-pointer flex gap-[5%] justify-center items-center text-[15pt] font-semibold hover:text-[#0B6EC9] duration-[0.3s]">
                  <AiFillBook className="text-[20pt]" />
                  <span>Reschedule</span>
                </div>
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

export default ShowAppointmentUpcoming;
