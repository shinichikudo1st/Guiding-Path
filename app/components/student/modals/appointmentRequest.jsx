const AppointmentRequest = () => {
  return (
    <div className="absolute flex flex-col w-[90%] h-[80%] bg-[#E6F0F9] border-[1px] border-[#062341] mt-[6%] items-center">
      <form className="flex w-[100%] h-[80%] text-[#062341]">
        <div className="flex flex-col justify-center items-center gap-[8%] p-[2%] w-[50%] h-[100%]">
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Name:</label>
            <input
              className="outline-none w-[70%] bg-transparent border-b-[2px] px-[2%] border-[#062341]"
              type="text"
            />
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Grade:</label>
            <input
              className="outline-none w-[70%] bg-transparent border-b-[2px] px-[2%] border-[#062341]"
              type="text"
            />
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Reason:</label>
            <select
              id="reason"
              class="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="US">Stress Management</option>
              <option value="CA">Encouragement</option>
              <option value="FR">Practicing Gusion</option>
              <option value="DE">Yessir</option>
            </select>
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Urgency:</label>
            <select
              id="urgency"
              class="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="US">Stress Management</option>
              <option value="CA">Encouragement</option>
              <option value="FR">Practicing Gusion</option>
              <option value="DE">Yessir</option>
            </select>
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Receive:</label>
            <select
              id="method"
              class="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="US">Stress Management</option>
              <option value="CA">Encouragement</option>
              <option value="FR">Practicing Gusion</option>
              <option value="DE">Yessir</option>
            </select>
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Contact:</label>
            <input
              className="outline-none w-[70%] bg-transparent border-b-[2px] px-[2%] border-[#062341]"
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-col p-[2%] w-[50%] h-[100%] justify-center gap-[5%]">
          <label className="text-[15pt] font-bold">Additional Notes:</label>
          <textarea
            name="notes"
            id="notes"
            className="h-[70%] rounded-[5px] p-[5%] font-sans bg-[#EDF2F5] border-[2px] border-[#062341]"
          ></textarea>
        </div>
      </form>
      <button
        type="submit"
        className="w-[20%] mt-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#0B6EC9] to-blue-500 group-hover:from-[#0B6EC9] group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span className="w-[100%] relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#83bef5] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-bold">
          Submit
        </span>
      </button>
    </div>
  );
};

export default AppointmentRequest;
