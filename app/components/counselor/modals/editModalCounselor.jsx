const EditModalCounselor = ({ editButton, profileData, retrieveProfile }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newName = formData.get("name") || "";
    const newDepartment = formData.get("department") || "";
    const contact = formData.get("contact") || "";

    const data = {
      name: newName,
      department: newDepartment,
      contact: contact,
    };

    try {
      const response = await fetch("/api/updateCounselor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const result = await response.json();
      console.log(result.message);

      retrieveProfile();
      editButton();
    } catch (error) {}
  };

  return (
    <div className="absolute h-[100%] w-[100%] flex pl-[30%] pt-[10%] bg-[#dfecf6] rounded-[20px] z-20">
      <button
        onClick={editButton}
        className=" right-1 top-3 absolute inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#0B6EC9] to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#dfecf6] dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          X
        </span>
      </button>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto absolute">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
          >
            New Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={profileData.name}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="year"
            className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
          >
            Set Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={profileData.department}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-bold text-gray-900 dark:text-white"
          >
            New Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={profileData.contact}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-[#0B6EC9] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditModalCounselor;
