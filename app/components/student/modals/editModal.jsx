import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaGraduationCap,
  FaBook,
  FaPhone,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import DOMPurify from "dompurify";

const EditModal = ({ editButton, profileData, retrieveProfile }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const newName = DOMPurify.sanitize(formData.get("name")) || "";
    const newYear = DOMPurify.sanitize(formData.get("year")) || "";
    const newCourse = DOMPurify.sanitize(formData.get("course")) || "";
    const contact = DOMPurify.sanitize(formData.get("contact")) || "";

    const data = {
      name: newName,
      grade_level: newYear,
      program: newCourse,
      contact: contact,
    };

    try {
      const response = await fetch("/api/updateUser", {
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

      setIsLoading(false);
      retrieveProfile();
      editButton();
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsLoading(false);
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
        className="max-w-sm mx-auto absolute space-y-6 xl:translate-y-[-10%] 2xl:translate-y-0"
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
            htmlFor="year"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <FaGraduationCap className="inline-block mr-2" />
            Year Level
          </label>
          <input
            type="text"
            id="year"
            name="year"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
            placeholder={profileData.year}
          />
        </div>

        <div>
          <label
            htmlFor="course"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            <FaBook className="inline-block mr-2" />
            Course
          </label>
          <input
            type="text"
            id="course"
            name="course"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300"
            placeholder={profileData.course}
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
          disabled={isLoading}
          className={`w-full text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0B6EC9] hover:bg-blue-800"
          } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2 h-5 w-5" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditModal;
