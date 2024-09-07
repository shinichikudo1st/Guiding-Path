import Image from "next/image";

const ManageRequest = ({ requests, closeButton, requestID }) => {
  const renderRequest = requests.find(
    (request) => request.request_id === requestID
  );

  const acceptRequest = async () => {
    try {
      const response = await fetch("/api/createAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {}
  };

  return (
    <div className=" absolute w-screen h-screen flex justify-center z-10">
      <div className="absolute w-full h-full translate-x-[-0.05%] translate-y-[-21.87%] bg-black opacity-75 z-20"></div>
      <div className="flex justify-center items-center bg-[#dfecf6] w-[40%] h-[80%] translate-y-[-15%] opacity-100 z-30 rounded-[20px]">
        <button
          onClick={closeButton}
          class="absolute right-[3%] top-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            X
          </span>
        </button>
        <div className="w-[80%] h-[80%] mt-[3%]">
          <div className="grid grid-rows-2 grid-cols-3 w-[100%] h-[30%] bg-pink-50">
            <div className="row-span-2 bg-yellow-50 flex justify-center items-center">
              <Image
                priority
                alt="profile picture"
                src={renderRequest.student.student.profilePicture}
                width={150}
                height={150}
                className="rounded-[999px] border-[2px] border-[#062341]"
              />
            </div>
            <div className=" bg-yellow-100 col-span-2 flex justify-center items-center text-[#062341] font-semibold">
              {renderRequest.name}
            </div>
            <div className=" bg-yellow-200 col-span-2 flex justify-center items-center italic">
              {renderRequest.grade}
            </div>
          </div>
          <div className="bg-pink-100 w-[100%] h-[15%] flex gap-[30%] items-center pl-[20%] font-medium">
            <label className="font-bold">Reason:</label>
            {renderRequest.reason}
          </div>
          <div className="bg-pink-100 w-[100%] h-[15%] flex gap-[30%] items-center pl-[20%] font-medium">
            <label className="font-bold">Urgency:</label>
            {renderRequest.urgency} urgent
          </div>
          <div className="h-[30%] bg-emerald-300 flex justify-center items-center italic font-semibold text-justify px-[30px] overflow-auto">
            "{renderRequest.notes}"
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequest;
