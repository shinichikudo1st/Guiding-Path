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
import { motion, AnimatePresence } from "framer-motion";

const EditModal = ({ editButton, profileData, retrieveProfile }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const newName = DOMPurify.sanitize(formData.get("name")) || "";
    const newYear = DOMPurify.sanitize(formData.get("year")) || "";
    const newCourse = DOMPurify.sanitize(formData.get("course")) || "";
    const newDepartment = DOMPurify.sanitize(formData.get("department")) || "";
    const contact = DOMPurify.sanitize(formData.get("contact")) || "";

    const data = {
      name: newName,
      grade_level: newYear,
      program: newCourse,
      department: newDepartment,
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

  const inputFields = [
    {
      icon: FaUser,
      name: "name",
      label: "Name",
      type: "text",
      placeholder: profileData.name,
    },
    {
      icon: FaGraduationCap,
      name: "year",
      label: "Year Level",
      type: "text",
      placeholder: profileData.year,
    },
    {
      icon: FaBook,
      name: "course",
      label: "Course",
      type: "text",
      placeholder: profileData.course,
    },
    {
      icon: FaBook,
      name: "department",
      label: "Department",
      type: "select",
      placeholder: profileData.department,
      options: [
        "College of Education",
        "College of Technology",
        "College of Engineering",
        "College of Arts and Sciences",
        "College of Management and Entrepreneurship",
        "College of Computer Information and Communications Technology",
      ],
    },
    {
      icon: FaPhone,
      name: "contact",
      label: "Contact",
      type: "text",
      placeholder: profileData.contact,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-[#0B6EC9]/10 w-full max-w-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={editButton}
            className="text-white hover:text-red-100 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          {inputFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[#062341]">
                <field.icon className="text-[#0B6EC9]" />
                {field.label}
              </label>
              {field.type === "select" ? (
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  name={field.name}
                  defaultValue={field.placeholder || ""}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#0B6EC9]/20 focus:border-[#0B6EC9]/50 focus:ring-2 focus:ring-[#0B6EC9]/20 outline-none transition-all duration-300 shadow-sm"
                >
                  <option value="" disabled>
                    Select {field.label}
                  </option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </motion.select>
              ) : (
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type={field.type}
                  name={field.name}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-[#0B6EC9]/20 focus:border-[#0B6EC9]/50 focus:ring-2 focus:ring-[#0B6EC9]/20 outline-none transition-all duration-300 shadow-sm"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0B6EC9] to-[#095396] hover:from-[#095396] hover:to-[#084B87] text-white shadow-md"
            }`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5" />
                Saving Changes...
              </>
            ) : (
              <>
                <FaSave className="h-5 w-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditModal;
