import { useState } from "react";
import {
  FaUser,
  FaGraduationCap,
  FaClipboardList,
  FaExclamationTriangle,
  FaVideo,
  FaPhoneAlt,
  FaStickyNote,
  FaPaperPlane,
} from "react-icons/fa";

const AppointmentRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    reason: "stress_management",
    urgency: "less",
    type: "virtual",
    contact: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/requestAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      setFormData({
        name: "",
        grade: "",
        reason: "stress_management",
        urgency: "less",
        type: "virtual",
        contact: "",
        notes: "",
      });
      console.log(result.message);
    } catch (error) {
      console.error("Error submitting appointment request:", error);
    }
  };

  return (
    <div className="absolute flex items-center justify-center w-[90%] h-[80%] bg-gradient-to-br from-[#F0F8FF] to-[#E6F0F9] mt-[6%] rounded-lg shadow-lg overflow-auto scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#D8E8F6]">
      <form onSubmit={handleSubmit} className="p-8 space-y-8 w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaUser className="text-[#0B6EC9] text-xl" />
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="flex items-center space-x-4">
              <FaGraduationCap className="text-[#0B6EC9] text-xl" />
              <input
                required
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                type="text"
                placeholder="Grade"
              />
            </div>
            <div className="flex items-center space-x-4">
              <FaClipboardList className="text-[#0B6EC9] text-xl" />
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option value="stress_management">Stress Management</option>
                <option value="encouragement">Encouragement</option>
                <option value="career_guidance">Career Guidance</option>
                <option value="emotional_support">Emotional Support</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <FaExclamationTriangle className="text-[#0B6EC9] text-xl" />
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option value="less">Less Urgent</option>
                <option value="somewhat">Somewhat Urgent</option>
                <option value="very">Very Urgent</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <FaVideo className="text-[#0B6EC9] text-xl" />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option value="virtual">Virtual/Online</option>
                <option value="inperson">In Person</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-[#0B6EC9] text-xl" />
              <input
                required
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="flex-grow bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                type="text"
                placeholder="Contact"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaStickyNote className="text-[#0B6EC9] text-xl mt-2" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="flex-grow h-64 bg-white border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                placeholder="Additional Notes"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0B6EC9] to-[#1E90FF] text-white text-lg font-bold rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B6EC9]"
          >
            <FaPaperPlane className="mr-3 text-xl" />
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentRequest;
