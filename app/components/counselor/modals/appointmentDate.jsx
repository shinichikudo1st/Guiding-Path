import { useState } from "react";

const ManageAppointmentDate = ({
  renderRequest,
  closeButton,
  closeButtonDate,
  initialRequests,
}) => {
  const [date, setDate] = useState(null);

  const onChangeHandler = (event) => {
    setDate(event.target.value);
  };

  const acceptRequest = async () => {
    if (!date) {
      return;
    }

    const data = {
      date: date,
      id: renderRequest.student_id,
      role: renderRequest.role,
      notes: renderRequest.notes,
      reason: renderRequest.reason,
    };

    try {
      const response = await fetch("/api/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await fetch(`/api/deleteRequest?id=${renderRequest.request_id}`, {
        method: "DELETE",
      });

      const result = response.json();
      console.log(result.message);
    } catch (error) {}

    initialRequests();
    closeButton();
  };

  return (
    <div className="absolute flex flex-col justify-center items-center bg-[#dfecf6] w-[40%] h-[80%] translate-y-[-15%] opacity-100 z-40 rounded-[20px]">
      <button
        onClick={closeButtonDate}
        className="absolute right-[3%] top-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          X
        </span>
      </button>
      <div className="flex flex-col justify-center items-center w-[80%] h-[50%] border-[2px] border-[#062341] bg-pink-300 rounded-[10px] gap-[10%] p-[5%]">
        <span className="text-[15pt] font-bold">Pick an appointment date:</span>
        <input
          onChange={onChangeHandler}
          type="date"
          className="w-[50%] text-[15pt] font-bold p-[5%] outline-none rounded-[10px]"
        />
      </div>
      <button
        onClick={acceptRequest}
        className="bottom-[10%] w-[20%] absolute inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span className="font-bold text-[15pt] relative w-[100%] px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Submit
        </span>
      </button>
    </div>
  );
};

export default ManageAppointmentDate;
