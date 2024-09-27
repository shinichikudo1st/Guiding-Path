import { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import DOMPurify from "dompurify";

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

  return (
    <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl p-8 w-96 z-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {["current", "new", "confirm"].map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={`${field}Password`}
                className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaLock className="text-gray-400 mr-2" />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="text-gray-400 focus:outline-none"
                  >
                    {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm mt-2 mb-2">{success}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
