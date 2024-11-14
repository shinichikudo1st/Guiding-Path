import Image from "next/image";
import { useState } from "react";
import ManageAppointmentDate from "./appointmentDate";
import { IoClose } from "react-icons/io5";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { MdPriorityHigh } from "react-icons/md";
import { BsChatQuoteFill } from "react-icons/bs";

const ManageRequest = ({
  requests,
  closeButton,
  requestID,
  initialRequests,
}) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleRejectRequest = async () => {
    try {
      const response = await fetch(`/api/deleteRequest?id=${requestID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        initialRequests();
        closeButton();
      } else {
        throw new Error("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const renderRequest = requests.find(
    (request) => request.request_id === requestID
  );

  return (
    <div className=" absolute w-screen h-screen flex justify-center z-10">
      <div className="absolute w-full h-full translate-x-[-0.05%] translate-y-[-21.87%] bg-black opacity-75 z-20"></div>
      {openDatePicker && (
        <ManageAppointmentDate
          renderRequest={renderRequest}
          closeButton={closeButton}
          closeButtonDate={() => setOpenDatePicker(false)}
          initialRequests={initialRequests}
        />
      )}
      <div className="imHereContainer flex flex-col bg-white w-[90%] max-w-[500px] h-[90%] max-h-[600px] shadow-2xl rounded-[20px] overflow-hidden z-30">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 relative">
          <h2 className="text-white text-xl font-semibold">
            {renderRequest.name}
          </h2>
          <button
            onClick={closeButton}
            className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              priority
              alt="profile picture"
              src={renderRequest.student.student.profilePicture}
              width={80}
              height={80}
              className="rounded-full border-2 border-cyan-500"
            />
            <div>
              <p className="text-gray-600">
                <FaUser className="inline mr-2" />
                {renderRequest.type}
              </p>
              <p className="text-gray-600">
                <MdPriorityHigh className="inline mr-2" />
                {renderRequest.urgency} urgent
              </p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700">Reason:</h3>
            <p className="text-gray-600">{renderRequest.reason}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-700 flex items-center">
              <BsChatQuoteFill className="mr-2" /> Notes:
            </h3>
            <p className="text-gray-600 italic">"{renderRequest.notes}"</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-4">
            <button
              onClick={() => setOpenDatePicker(true)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-colors flex items-center justify-center"
            >
              <FaCalendarAlt className="mr-2" /> Accept Request
            </button>
            <button
              onClick={handleRejectRequest}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors flex items-center justify-center"
            >
              <IoClose className="mr-2" /> Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequest;
