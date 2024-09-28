import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const ModifyUser = ({ onClose, userID }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(``, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        setNotification({
          type: "success",
          message: "User role updated successfully",
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const data = await response.json();
        setNotification({
          type: "error",
          message: data.message || "Failed to update user role",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "An error occurred while updating user role",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Modify User Role
        </h2>
        {notification && (
          <div
            className={`mb-6 p-3 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-3">
              Select New Role
            </label>
            <div className="flex justify-between space-x-3">
              {["teacher", "student", "counselor"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === role
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  disabled={isLoading}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRole || isLoading}
              className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-all ${
                selectedRole && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : null}
              {isLoading ? "Updating..." : "Update Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyUser;
