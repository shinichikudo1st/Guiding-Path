import { useEffect, useState } from "react";

const PendingAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const retrievePendingAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pendingAppointments");
      const result = await response.json();

      console.log(result.message);
      setAppointments(result.appointment);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    retrievePendingAppointments();
  }, []);

  return (
    <div className="absolute w-[90%] h-[80%] bg-[#E6F0F9] border-[1px] border-[#062341] mt-[6%] items-center overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#A8B9C9]">
      {loading ? (
        <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            Loading Appointments...
          </div>
        </div>
      ) : (
        appointments &&
        appointments.map((appointment) => (
          <div
            className="flex h-[45%] w-[100%] mt-[2%]"
            key={appointment.appointment_id}
          >
            <div className="flex w-[70%] h-[100%] border-y-[1px] border-[#062341] bg-[#EDF6FF]">
              <div className="w-[35%] h-[100%] flex justify-center p-[5%]">
                <span className="bg-red-500 w-[130px] h-[130px] rounded-[999px]"></span>
              </div>
              <div className="flex flex-col justify-center pl-[5%] gap-[10%] w-[65%] h-[100%] ">
                <div>
                  <label className="font-bold">Counselor:</label>
                  <span className="ml-[2%]">
                    {appointment.counselor.counselor.name}
                  </span>
                </div>
                <div>
                  <label className="font-bold">Contact Info:</label>
                  <span className="ml-[2%]">
                    {appointment.counselor.counselor.contact}
                  </span>
                </div>
                <div>
                  <label className="font-bold">Date & Time:</label>
                  <span className="ml-[2%]">September 32, 2024 - 4:00PM</span>
                </div>
                <div>
                  <label className="font-bold">Location:</label>
                  <span className="ml-[2%]">CTU-Admin Room 301A</span>
                </div>
                <div>
                  <label className="font-bold">Type:</label>
                  <span className="ml-[2%]">{appointment.type}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-[50%] w-[30%] p-[3%] border-y-[1px] border-[#062341] bg-[#C9DFF2]">
              <div>
                <span>Please wait for the schedule</span>
              </div>
              <button className="w-[60%] mt-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#0B6EC9] to-blue-500 group-hover:from-[#0B6EC9] group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="w-[100%] relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#83bef5] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-bold">
                  Reschedule
                </span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingAppointment;
