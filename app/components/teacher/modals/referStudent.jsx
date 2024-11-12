import { useState } from "react";
import DOMPurify from "dompurify";
import {
  FaClipboardList,
  FaSearch,
  FaCommentAlt,
  FaPaperPlane,
} from "react-icons/fa";
import Image from "next/image";

const ReferStudent = () => {
  const [formData, setFormData] = useState({
    reason: "",
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showResults, setShowResults] = useState(false);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 2) {
      handleSearch(value);
    } else {
      setSearchResults([]);
    }
    setShowResults(true);
  };

  const handleSearch = async (searchTerm) => {
    setSearchLoading(true);
    try {
      const response = await fetch(
        `/api/getAllUser?page=1&role=student&search=${DOMPurify.sanitize(
          searchTerm
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const result = await response.json();
      setSearchResults(result.users);
    } catch (error) {
      console.error("Error searching for students:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
    setSearch(student.name);
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      showNotification("Please select a student", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const sanitizedFormData = {
        studentId: selectedStudent.user_id,
        reason: DOMPurify.sanitize(formData.reason),
        notes: DOMPurify.sanitize(formData.additionalNotes),
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
        <div className="flex flex-col relative">
          <label
            htmlFor="search"
            className="font-semibold text-base text-[#062341] mb-2 flex items-center"
          >
            <FaSearch className="mr-3" /> Search Student
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="outline-none bg-white border px-3 py-2 border-[#062341] rounded focus:border-[#0B6EC9] transition duration-300 text-base"
            placeholder="Search for a student..."
          />

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((student) => (
                <div
                  key={student.user_id}
                  onClick={() => selectStudent(student)}
                  className="flex items-center p-3 hover:bg-[#f8fafc] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={student.profilePicture}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border border-[#0B6EC9]"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#062341]">
                        {student.name}
                      </span>
                      <span className="text-xs bg-[#E6F0F9] text-[#0B6EC9] px-2 py-1 rounded-full">
                        Student
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {student.email}
                    </span>
                  </div>
                </div>
              ))}
              {searchLoading && (
                <div className="p-3 text-center text-gray-500">
                  <div className="animate-pulse">Searching...</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Student Display */}
        {selectedStudent && (
          <div className="bg-white p-4 rounded-lg border-l-4 border-[#0B6EC9] shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Image
                  src={selectedStudent.profilePicture}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-[#0B6EC9] shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-[#062341]">
                    {selectedStudent.name}
                  </span>
                  <span className="text-sm text-[#0B6EC9]">
                    {selectedStudent.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedStudent(null);
                  setSearch("");
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

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
          className={`bg-[#0B6EC9] absolute bottom-4 text-white font-bold py-3 px-6 rounded-full hover:bg-[#095396] transition duration-300 self-center flex items-center text-base ${
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
