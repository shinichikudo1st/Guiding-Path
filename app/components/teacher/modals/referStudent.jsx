import { useState } from "react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaSearch,
  FaCommentAlt,
  FaPaperPlane,
  FaTimes,
  FaSpinner,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden p-6 sm:p-8"
    >
      {notification.message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute top-4 right-4 p-3 rounded-lg shadow-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Student Section */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-[#062341]/70">
            <FaSearch className="text-[#0B6EC9]" />
            Search Student
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-xl border border-[#0B6EC9]/10 focus:border-[#0B6EC9] focus:ring-1 focus:ring-[#0B6EC9] transition-all duration-300 outline-none bg-white/50"
              placeholder="Search for a student..."
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-[#0B6EC9]/10 overflow-hidden z-10"
              >
                {searchResults.map((student) => (
                  <motion.div
                    key={student.user_id}
                    whileHover={{ backgroundColor: "#F8FAFC" }}
                    onClick={() => selectStudent(student)}
                    className="p-4 cursor-pointer border-b border-[#0B6EC9]/10 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-[#0B6EC9]">
                        <Image
                          src={student.profilePicture}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#062341]">
                            {student.name}
                          </span>
                          <span className="text-xs bg-[#0B6EC9]/10 text-[#0B6EC9] px-3 py-1 rounded-full font-medium">
                            Student
                          </span>
                        </div>
                        <span className="text-sm text-[#062341]/70">
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Selected Student Display */}
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 border-l-4 border-[#0B6EC9] shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-[#0B6EC9]">
                  <Image
                    src={selectedStudent.profilePicture}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#062341]">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-[#0B6EC9]">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedStudent(null)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-[#062341]/70">
              <FaClipboardList className="text-[#0B6EC9]" />
              Reason for Referral
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#0B6EC9]/10 focus:border-[#0B6EC9] focus:ring-1 focus:ring-[#0B6EC9] transition-all duration-300 outline-none bg-white/50 min-h-[100px] resize-none"
              placeholder="Enter the reason for referral..."
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-[#062341]/70">
              <FaCommentAlt className="text-[#0B6EC9]" />
              Additional Notes
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#0B6EC9]/10 focus:border-[#0B6EC9] focus:ring-1 focus:ring-[#0B6EC9] transition-all duration-300 outline-none bg-white/50 min-h-[100px] resize-none"
              placeholder="Enter any additional notes..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl py-3 px-6 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin h-5 w-5" />
              Submitting...
            </>
          ) : (
            <>
              <FaPaperPlane className="h-5 w-5" />
              Submit Referral
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReferStudent;
