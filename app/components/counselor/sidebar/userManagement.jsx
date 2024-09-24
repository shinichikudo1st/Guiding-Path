import { IoMdSearch } from "react-icons/io";
import {
  FaUsersCog,
  FaUserEdit,
  FaUserMinus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState("allRoles");
  const [search, setSearch] = useState("");

  const retrieveUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getAllUser?page=${currentPage}&role=${selectedRole}&search=${search}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const result = await response.json();

      setUsers(result.users);
      setTotalPages(result.totalPages);
    } catch (error) {
      setError(error.message);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    retrieveUsers();
  }, [selectedRole, currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Add this function to determine the role color
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "counselor":
        return "bg-blue-200 text-blue-800";
      case "teacher":
        return "bg-green-200 text-green-800";
      case "student":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <>
      <div className="userContainer absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center">
        <div className="flex items-center justify-between w-full h-[15%] px-6">
          <h1 className="text-3xl font-bold text-[#062341] flex items-center">
            <FaUsersCog className="mr-3" />
            User Management
          </h1>
          <div className="flex items-center space-x-4">
            <select
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-white text-[#062341] py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5B9B] border border-[#062341]"
            >
              <option value="allRoles">All Roles</option>
              <option value="counselor">Counselor</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
            <div className="relative">
              <input
                type="search"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-[#062341] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5B9B]"
                value={search}
                onChange={handleSearch}
              />
              <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#062341]" />
            </div>
          </div>
        </div>

        <div className="w-full px-6 mt-4 flex-grow overflow-auto">
          <div className="bg-white rounded-lg shadow-md">
            <table className="w-full">
              <thead className="bg-[#1F5B9B] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      <div className="animate-pulse text-[#1F5B9B]">
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-red-500">
                      Error: {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            alt="Profile"
                            src={user.profilePicture}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-[#062341]">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FaUserEdit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            title="Remove"
                          >
                            <FaUserMinus size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full px-6 py-4 flex items-center justify-between bg-white border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(currentPage * 10, totalPage * 10)}
              </span>{" "}
              of <span className="font-semibold">{totalPage * 10}</span> results
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1F5B9B] hover:bg-[#1F5B9B] hover:text-white"
              } transition-colors`}
            >
              <FaChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPage}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPage}
              className={`p-2 rounded-full ${
                currentPage === totalPage
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1F5B9B] hover:bg-[#1F5B9B] hover:text-white"
              } transition-colors`}
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
