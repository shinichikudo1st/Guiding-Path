import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import {
  FaGraduationCap,
  FaClipboardList,
  FaExclamationTriangle,
  FaVideo,
  FaPhoneAlt,
  FaStickyNote,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AppointmentRequest = () => {
  const [formData, setFormData] = useState({
    grade: "",
    reason: "",
    urgency: "",
    type: "",
    contact: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Final sanitization before submission
    const sanitizedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        DOMPurify.sanitize(value),
      ])
    );

    try {
      const response = await fetch("/api/requestAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedFormData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "An error occurred while submitting the request."
        );
      }

      setFormData({
        grade: "",
        reason: "",
        urgency: "",
        type: "",
        contact: "",
        notes: "",
      });
      setSuccessMessage(result.message);
    } catch (error) {
      console.error("Error submitting appointment request:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col p-6">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="h-full bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-[#0B6EC9] text-xl flex-shrink-0" />
                  <input
                    required
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] placeholder-[#062341]/50 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                    type="text"
                    placeholder="Grade Level"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <FaClipboardList className="text-[#0B6EC9] text-xl flex-shrink-0" />
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                  >
                    <option value="" disabled>
                      Select Reason
                    </option>
                    <option value="stress_management">Stress Management</option>
                    <option value="encouragement">Encouragement</option>
                    <option value="career_guidance">Career Guidance</option>
                    <option value="emotional_support">Emotional Support</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-[#0B6EC9] text-xl flex-shrink-0" />
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                  >
                    <option value="" disabled>
                      Select Urgency
                    </option>
                    <option value="less">Less Urgent</option>
                    <option value="somewhat">Somewhat Urgent</option>
                    <option value="very">Very Urgent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="h-full bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FaVideo className="text-[#0B6EC9] text-xl flex-shrink-0" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="virtual">Virtual/Online</option>
                    <option value="inperson">In Person</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-[#0B6EC9] text-xl flex-shrink-0" />
                  <input
                    required
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] placeholder-[#062341]/50 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                    type="text"
                    placeholder="Contact Information"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <FaStickyNote className="text-[#0B6EC9] text-xl flex-shrink-0 mt-2" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] placeholder-[#062341]/50 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20 min-h-[120px] resize-none"
                    placeholder="Additional Notes"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {(errorMessage || successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl text-center font-medium ${
              errorMessage
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {errorMessage || successMessage}
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-medium text-sm hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaPaperPlane className="mr-2" />
            )}
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentRequest;
