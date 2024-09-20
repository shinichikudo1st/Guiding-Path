import Image from "next/image";

const AppointmentSingleDashboard = ({ closeButton, appointment }) => {
  return (
    <div className="absolute w-screen h-screen flex justify-center z-10">
      <div className="absolute w-full h-full bg-black opacity-75 z-20"></div>
      <div className="flex flex-col p-[5%] bg-[#dfecf6] w-[60%] h-[80%] translate-y-[10%] opacity-100 z-30 rounded-[20px]">
        <button
          onClick={closeButton}
          className="absolute right-[3%] top-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            X
          </span>
        </button>
        <div className="flex items-center h-[40%]">
          <div className="h-[100%] w-[33.3%] flex justify-center items-center">
            <Image
              alt="profilePicture"
              src={appointment.student.student.profilePicture}
              height={200}
              width={200}
              className="rounded-[999px] border-[2px] border-[#062341]"
            />
          </div>
          <div className="flex flex-col items-center justify-center h-[100%] w-[33.3%]">
            <span className="text-[25pt] font-semibold text-[#062341]">
              {appointment.student.student.name}
            </span>
            <span className="text-[#858C92]">
              {appointment.student.student.email}
            </span>
          </div>
          <div className="flex justify-center items-center h-[100%] w-[33.3%] text-[15pt] text-[#F75555] font-bold">
            {appointment.date_time}
          </div>
        </div>
        <div className="flex flex-col h-[60%]">
          <div className="h-[20%] flex items-center pl-[10%] gap-[10%] text-[15pt]">
            <span>Location:</span>
            <span className="font-bold">
              {appointment.counsel_type === "virtual"
                ? "Gmeet"
                : "Admin Building Room 3A1"}
            </span>
          </div>
          <div className="h-[20%] flex items-center pl-[10%] gap-[10%]  text-[15pt]">
            <span>Description:</span>
            <span className="font-bold">{appointment.reason}</span>
          </div>
          <div className="flex flex-col gap-5 h-[60%] pt-[2%] pl-[10%]  text-[15pt]">
            <span>Additional Notes:</span>
            <span className="ml-[5%] font-bold">{appointment.notes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSingleDashboard;
