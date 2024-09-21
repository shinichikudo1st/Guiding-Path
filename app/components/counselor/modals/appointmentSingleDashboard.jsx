import Image from "next/image";
import {
  IoClose,
  IoLocationOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

const AppointmentSingleDashboard = ({ closeButton, appointment }) => {
  const location =
    appointment.counsel_type === "virtual"
      ? "Google Meet"
      : "CTU-MAIN Admin Building Room 301A";

  return (
    <div className="absolute w-screen h-screen flex justify-center z-10">
      <div className="absolute w-full h-full  bg-black opacity-75 z-20"></div>
      <div className="bg-white w-[90%] max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl z-30 translate-y-[10%]">
        <div className="relative p-8">
          <button
            onClick={closeButton}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>

          {/* Student Information */}
          <div className="flex flex-col md:flex-row items-center mb-8 border-b pb-6">
            <Image
              alt="profilePicture"
              src={appointment.student.student.profilePicture}
              height={120}
              width={120}
              className="rounded-full border-4 border-blue-200 shadow-md mb-4 md:mb-0"
            />
            <div className="md:ml-8 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {appointment.student.student.name}
              </h2>
              <p className="text-gray-600">
                {appointment.student.student.email}
              </p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8 shadow-inner">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Appointment Details
            </h3>
            <div className="flex items-center text-blue-800 mb-4">
              <IoCalendarOutline size={24} className="mr-4 text-blue-600" />
              <span className="text-xl font-semibold">
                {appointment.date_time}
              </span>
            </div>
            <div className="flex items-center text-gray-700 mb-4">
              <IoLocationOutline size={24} className="mr-4 text-green-600" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <IoDocumentTextOutline
                size={24}
                className="mr-4 text-purple-600"
              />
              <span>{appointment.reason}</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              Additional Notes
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {appointment.notes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSingleDashboard;
