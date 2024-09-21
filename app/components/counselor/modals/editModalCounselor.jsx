import { FaTimes, FaUser, FaBuilding, FaPhone, FaSave } from "react-icons/fa";

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
    } catch (error) {
      console.error("Error updating profile:", error);
      // TODO: Add user-friendly error handling
    }
  };

  return (
    <div className="absolute h-[100%] w-[100%] flex pl-[30%] pt-[10%] bg-[#dfecf6] rounded-[20px] z-20">
      <button
        onClick={editButton}
        className="right-4 top-4 absolute inline-flex items-center justify-center p-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-white hover:bg-[#0B6EC9] hover:text-white transition-all duration-300 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        <FaTimes className="h-6 w-6" />
      </button>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto absolute space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <FaUser className="inline-block mr-2" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
            placeholder={profileData.name}
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <FaBuilding className="inline-block mr-2" />
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
            placeholder={profileData.department}
          />
        </div>

        <div>
          <label
            htmlFor="contact"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <FaPhone className="inline-block mr-2" />
            Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
            placeholder={profileData.contact}
          />
        </div>
        <button
          type="submit"
          className="w-full text-white bg-[#0B6EC9] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 flex items-center justify-center"
        >
          <FaSave className="mr-2" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditModalCounselor;
