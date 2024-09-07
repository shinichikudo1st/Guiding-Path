const GenerateReport = () => {
  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col px-[4%] pt-[3%] gap-[5%]">
        <h1 className="text-[30pt] text-[#062341] font-bold">
          Generate Report
        </h1>
        <form className="flex w-[100%] h-[60%]">
          <div className="w-[60%] h-[100%]">
            <div className="w-[100%] h-[60%] flex flex-col gap-[10%]">
              <span className="text-[15pt] text-[#565B60]">
                Select related reports to generate:
              </span>
              <div className="grid grid-cols-2 ml-[5%] gap-[10%]">
                <div className="flex items-center mb-4">
                  <input
                    id="default1"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 bg-[#dbe9f6] border-gray-300 rounded-[5px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-[13pt] font-semibold  text-[#565B60] dark:text-gray-300">
                    Appointment
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default2"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 bg-[#dbe9f6] border-gray-300 rounded-[5px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-[13pt] font-semibold  text-[#565B60] dark:text-gray-300">
                    Appraisal
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default3"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 bg-[#dbe9f6] border-gray-300 rounded-[5px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-[13pt] font-semibold  text-[#565B60] dark:text-gray-300">
                    Referral
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default4"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 bg-[#dbe9f6] border-gray-300 rounded-[5px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-[13pt] font-semibold  text-[#565B60] dark:text-gray-300">
                    System Usage
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="default5"
                    type="checkbox"
                    value=""
                    className="w-6 h-6 bg-[#dbe9f6] border-gray-300 rounded-[5px] focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-[13pt] font-semibold  text-[#565B60] dark:text-gray-300">
                    Resource
                  </label>
                </div>
              </div>
            </div>
            <div className="w-[100%] h-[40%]">
              <span className="text-[15pt] text-[#565B60]">
                Select report date range:
              </span>
              <div className="flex h-[60%] mt-[3%] justify-evenly">
                <div className="flex flex-col w-[40%] text-[15pt] gap-[5%]">
                  <label className="font-semibold text-[#565B60]">
                    Start Date:
                  </label>
                  <input
                    className="bg-[#dbe9f6] text-[#81858A] text-center border-[1px] border-[#565B60] p-[3%] rounded-[5px]"
                    type="date"
                  />
                </div>
                <div className="flex flex-col w-[40%] text-[15pt] gap-[5%]">
                  <label className="font-semibold text-[#565B60]">
                    End Date:
                  </label>
                  <input
                    className="bg-[#dbe9f6] text-[#81858A] text-center border-[1px] border-[#565B60] p-[3%] rounded-[5px]"
                    type="date"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[40%] h-[90%] bg-[#c3daf0] rounded-[10px]"></div>
        </form>
        <button
          type="submit"
          className="w-[30%] h-[10%] rounded-[10px] font-semibold text-[#E6F0F9] bg-[#062341] ml-[70%]"
        >
          Generate Report
        </button>
      </div>
    </>
  );
};

export default GenerateReport;
