import { useState } from "react";
import { FaTimes, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const DeleteUser = ({ onClose, userID, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/deleteUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ counselorPassword: password, userID: userID }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete user");
      }
    } catch (error) {
      setError("An error occurred while deleting the user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-800"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={24} />
        </button>
        <div className="flex items-center mb-6">
          <FaExclamationTriangle className="text-red-600 mr-4" size={32} />
          <h2 className="text-3xl font-bold text-gray-800">Delete User</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Warning: This action cannot be undone. All user data will be
          permanently deleted from the system.
        </p>
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter your password to confirm
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password || isLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-all ${
                password && !isLoading
                  ? "bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin inline-block mr-2" />
              ) : null}
              {isLoading ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUser;
