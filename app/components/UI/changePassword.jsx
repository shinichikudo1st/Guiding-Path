import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaSpinner, FaTimes } from "react-icons/fa";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const ChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleInputChange = (field, value) => {
    const sanitizedValue = sanitizeInput(value);
    switch (field) {
      case "current":
        setCurrentPassword(sanitizedValue);
        break;
      case "new":
        setNewPassword(sanitizedValue);
        break;
      case "confirm":
        setConfirmPassword(sanitizedValue);
        break;
    }
  };

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess("");
        onClose(); // Close the modal after the success message disappears
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, onClose]);

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 5000); // Error message disappears after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: sanitizeInput(currentPassword),
          password: sanitizeInput(newPassword),
          confirmPassword: sanitizeInput(confirmPassword),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Reset form fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character";
    return null;
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center z-[100] bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </motion.button>

        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          Change Password
        </motion.h2>

        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-3 rounded-lg ${
              success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error || success}
          </motion.div>
        )}

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {["current", "new", "confirm"].map((field, index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="relative"
            >
              <label
                htmlFor={`${field}Password`}
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)} Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field] ? "text" : "password"}
                  id={`${field}Password`}
                  value={
                    field === "current"
                      ? currentPassword
                      : field === "new"
                      ? newPassword
                      : confirmPassword
                  }
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end space-x-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading && (
                <FaSpinner className="animate-spin inline-block mr-2" />
              )}
              {isLoading ? "Changing..." : "Change Password"}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default ChangePassword;
