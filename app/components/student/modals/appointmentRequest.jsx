const AppointmentRequest = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
      name: formData.get("name"),
      grade: formData.get("grade"),
      reason: formData.get("reason"),
      urgency: formData.get("urgency"),
      type: formData.get("type"),
      contact: formData.get("contact"),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/requestAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      event.target.reset();
      console.log(result.message);
    } catch (error) {}
  };

  return (
    <div className="absolute flex flex-col w-[90%] h-[80%] bg-[#E6F0F9] border-[1px] border-[#062341] mt-[6%] items-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-[100%] h-[80%] text-[#062341]"
      >
        <div className="flex flex-col justify-center items-center gap-[8%] p-[2%] w-[50%] h-[100%]">
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Name:</label>
            <input
              required
              name="name"
              className="outline-none w-[70%] bg-transparent border-b-[2px] px-[2%] border-[#062341]"
              type="text"
            />
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Grade:</label>
            <input
              required
              name="grade"
              className="outline-none w-[70%] bg-transparent border-b-[2px] px-[2%] border-[#062341]"
              type="text"
            />
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Reason:</label>
            <select
              name="reason"
              id="reason"
              className="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="stress_management">Stress Management</option>
              <option value="encouragement">Encouragement</option>
              <option value="career_guidance">Career Guidance</option>
              <option value="emotional_support">Emotional Support</option>
            </select>
          </div>
          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Urgency:</label>
            <select
              name="urgency"
              id="urgency"
              className="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="less">Less Urgent</option>
              <option value="somewhat">Somewhat Urgent</option>
              <option value="very">Very Urgent</option>
            </select>
          </div>

          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Urgency:</label>
            <select
              name="type"
              id="type"
              className="font-semibold outline-none w-[70%] bg-[#CFE2F2] border-[1px] border-[#062341] text-[#062341] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="virtual">Virtual/Online</option>
              <option value="inperson">In Person</option>
            </select>
          </div>

          <div className="w-[90%] flex justify-between pl-[2%]">
            <label className="font-semibold text-[17pt]">Contact:</label>
            <input
              required
              name="contact"
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
        <button
          type="submit"
          className="absolute bottom-10 right-[40%] w-[20%] mt-[3%] inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#0B6EC9] to-blue-500 group-hover:from-[#0B6EC9] group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
        >
          <span className="w-[100%] relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#83bef5] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 font-bold">
            Submit
          </span>
        </button>
      </form>
    </div>
  );
};

export default AppointmentRequest;
