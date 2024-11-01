import { useState } from "react";
import DOMPurify from "dompurify";
import {
  FaUser,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCommentAlt,
  FaPaperPlane,
} from "react-icons/fa";

const ReferStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    teacherId: "",
    reason: "",
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const sanitizedFormData = {
        studentId: DOMPurify.sanitize(formData.studentId),
        teacherId: DOMPurify.sanitize(formData.teacherId),
        reason: DOMPurify.sanitize(formData.reason),
        additionalNotes: DOMPurify.sanitize(formData.additionalNotes),
      };
      const response = await fetch("/api/createReferral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedFormData),
      });
      const result = await response.json();
      if (response.ok) {
        showNotification("Referral submitted successfully!", "success");
        setFormData({
          studentId: "",
          teacherId: "",
          reason: "",
          additionalNotes: "",
        });
      } else {
        showNotification(
          result.message || "Error submitting referral",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting referral:", error);
      showNotification(
        "An unexpected error occurred. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-[85%] bg-[#E6F0F9] p-6 rounded-lg shadow-md overflow-y-auto relative scrollbar-thin scrollbar-thumb-[#0B6EC9] scrollbar-track-[#e2eefe]">
      <h2 className="text-3xl font-bold text-[#062341] mb-6">
        Student Referral Form
      </h2>
      {notification.message && (
        <div
          className={`absolute top-4 right-4 mb-4 p-2 rounded ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label
            htmlFor="studentId"
            className="font-semibold text-base text-[#062341] mb-2 flex items-center"
          >
            <FaUser className="mr-3" /> Student ID
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            className="outline-none bg-white border px-3 py-2 border-[#062341] rounded focus:border-[#0B6EC9] transition duration-300 text-base"
            placeholder="Enter student ID"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="teacherId"
            className="font-semibold text-base text-[#062341] mb-2 flex items-center"
          >
            <FaChalkboardTeacher className="mr-3" /> Teacher ID
          </label>
          <input
            type="text"
            id="teacherId"
            name="teacherId"
            value={formData.teacherId}
            onChange={handleChange}
            required
            className="outline-none bg-white border px-3 py-2 border-[#062341] rounded focus:border-[#0B6EC9] transition duration-300 text-base"
            placeholder="Enter teacher ID"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="reason"
            className="font-semibold text-base text-[#062341] mb-2 flex items-center"
          >
            <FaClipboardList className="mr-3" /> Reason for Referring
          </label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="outline-none bg-white border px-3 py-2 border-[#062341] rounded focus:border-[#0B6EC9] transition duration-300 text-base"
          >
            <option value="">Select a reason</option>
            <option value="emotional_support">Emotional Support</option>
            <option value="encouragement">Encouragement</option>
            <option value="stress_management">Stress Management</option>
            <option value="career_guidance">Career Guidance</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="additionalNotes"
            className="font-semibold text-base text-[#062341] mb-2 flex items-center"
          >
            <FaCommentAlt className="mr-3" /> Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows="4"
            className="outline-none bg-white border px-3 py-2 border-[#062341] rounded focus:border-[#0B6EC9] transition duration-300 resize-none text-base"
            placeholder="Enter any additional notes here..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#0B6EC9] text-white font-bold py-3 px-6 rounded-full hover:bg-[#095396] transition duration-300 self-center mt-4 flex items-center text-base ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <FaPaperPlane className="mr-3" />
              Submit Referral
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReferStudent;
