import { IoMdSearch } from "react-icons/io";
import {
  FaUsersCog,
  FaUserMinus,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaUserCheck,
  FaSpinner,
  FaEdit,
  FaArchive,
  FaBoxOpen,
  FaFileUpload,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import ModifyUser from "../modals/userManagement/modifyUser";
import ArchiveUser from "../modals/userManagement/archiveUser";
import DeleteUser from "../modals/userManagement/deleteUser";
import UnarchiveUser from "../modals/userManagement/unarchiveUser";
import { motion } from "framer-motion";
import UserDetails from "../modals/userManagement/userDetail";
import * as XLSX from 'xlsx';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState("allRoles");
  const [search, setSearch] = useState("");
  const [isModifyUserModalOpen, setIsModifyUserModalOpen] = useState(false);
  const [isArchiveUserModalOpen, setIsArchiveUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isUnarchiveUserModalOpen, setIsUnarchiveUserModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadStats, setUploadStats] = useState(null);

  const retrieveUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = showArchived
        ? "/api/getAllArchivedUser"
        : "/api/getAllUser";
      const response = await fetch(
        `${endpoint}?page=${currentPage}&role=${selectedRole}&search=${DOMPurify.sanitize(
          search
        )}`
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
  }, [selectedRole, currentPage, search, showArchived]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModifyUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsModifyUserModalOpen(true);
  };

  const closeModifyUserModal = () => {
    setIsModifyUserModalOpen(false);
    setSelectedUserId(null);
  };

  const openArchiveUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsArchiveUserModalOpen(true);
  };

  const closeArchiveUserModal = () => {
    setIsArchiveUserModalOpen(false);
    setSelectedUserId(null);
  };

  const openDeleteUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setSelectedUserId(null);
  };

  const openUnarchiveUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsUnarchiveUserModalOpen(true);
  };

  const closeUnarchiveUserModal = () => {
    setIsUnarchiveUserModalOpen(false);
    setSelectedUserId(null);
  };

  const handleArchiveSuccess = () => {
    retrieveUsers(); // Fetch updated user list
  };

  const handleUnarchiveSuccess = () => {
    retrieveUsers();
  };

  const toggleArchived = () => {
    setShowArchived(!showArchived);
    setCurrentPage(1); // Reset to first page when switching views
  };

  const handleDeleteUser = async () => {
    closeDeleteUserModal();
    retrieveUsers();
  };

  const handleModifySuccess = () => {
    retrieveUsers(); // Fetch updated user list
  };

  const handleUserClick = (user, e) => {
    // Prevent click when clicking action buttons
    if (e.target.closest("button")) return;
    setSelectedUserDetails(user);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    setUploadStats(null);
    
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: ['check_id', 'role'] });

        // Remove header row if exists
        if (data.length > 0 && data[0].check_id === 'check_id') {
          data.shift();
        }

        const response = await fetch('/api/uploadChecks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ checks: data }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to upload checks');
        }

        setUploadSuccess(true);
        setUploadStats(result);
        
        // Only auto-close if there were no skipped records
        if (result.skipped === 0) {
          setTimeout(() => {
            setIsUploadModalOpen(false);
            setUploadSuccess(false);
            setUploadStats(null);
          }, 2000);
        }
      } catch (error) {
        setUploadError(error.message);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const renderTableRow = (user) => (
    <>
      <td
        className="py-4 px-4 cursor-pointer"
        onClick={(e) => handleUserClick(user, e)}
      >
        <div className="flex items-center gap-3">
          <Image
            src={user.profilePicture}
            alt={user.name}
            width={40}
            height={40}
            className={`rounded-full ${showArchived ? "grayscale" : ""}`}
          />
          <div>
            <p className="font-semibold text-[#062341]">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td
        className="py-4 px-4 text-center cursor-pointer"
        onClick={(e) => handleUserClick(user, e)}
      >
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            user.role === "counselor"
              ? "bg-blue-200 text-blue-800"
              : user.role === "teacher"
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModifyUserModal(user.user_id)}
            className="p-2 rounded-xl bg-[#0B6EC9]/10 text-[#0B6EC9] hover:bg-[#0B6EC9]/20 transition-all duration-300"
            title="Modify User"
          >
            <FaEdit />
          </motion.button>
          {showArchived ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openUnarchiveUserModal(user.user_id)}
                className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-300"
                title="Unarchive User"
              >
                <FaBoxOpen />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openDeleteUserModal(user.user_id)}
                className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                title="Delete User"
              >
                <FaTrash />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openArchiveUserModal(user.user_id)}
              className="p-2 rounded-xl bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all duration-300"
              title="Archive User"
            >
              <FaArchive />
            </motion.button>
          )}
        </div>
      </td>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <FaUsersCog className="text-white text-2xl" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  User Management
                </h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleArchived}
                className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  showArchived
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {showArchived ? (
                  <FaUserCheck className="text-sm" />
                ) : (
                  <FaUserMinus className="text-sm" />
                )}
                {showArchived ? "Show Active Users" : "Show Archived Users"}
              </motion.button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaFileUpload />
                Upload Credentials
              </button>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-3 border border-[#0B6EC9]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20 bg-white/50"
                  value={search}
                  onChange={handleSearch}
                />
                <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#062341]/70 text-xl" />
              </div>
              <select
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full sm:w-auto min-w-[150px] bg-white/50 text-[#062341] py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20 border border-[#0B6EC9]/20"
              >
                <option value="allRoles">All Roles</option>
                <option value="counselor">Counselor</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-white/50 rounded-xl border border-[#0B6EC9]/10 overflow-hidden shadow-md">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-center">Role</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B6EC9]/10">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block"
                        >
                          <FaSpinner className="text-[#0B6EC9] text-2xl" />
                        </motion.div>
                        <p className="text-[#062341]/70 mt-2">
                          Loading users...
                        </p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8">
                        <div className="text-red-500">{error}</div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-8">
                        <p className="text-[#062341]/70">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <motion.tr
                        key={user.user_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-[#0B6EC9]/5 transition-colors"
                      >
                        {renderTableRow(user)}
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination styled like profile buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-[#062341]/70">
              <p className="text-sm font-medium">
                Showing{" "}
                <span className="font-semibold">
                  {users.length === 0 ? 0 : (currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * 10 + users.length}
                </span>{" "}
                of <span className="font-semibold">{totalPages}</span> results
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={previousPage}
                  disabled={currentPage === 1 || users.length === 0}
                  className="p-3 rounded-xl border border-[#0B6EC9]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-all duration-300 shadow-sm"
                >
                  <FaChevronLeft className="text-[#062341]" />
                </motion.button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextPage}
                  disabled={currentPage === totalPages || users.length === 0}
                  className="p-3 rounded-xl border border-[#0B6EC9]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0B6EC9]/5 transition-all duration-300 shadow-sm"
                >
                  <FaChevronRight className="text-[#062341]" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      {isModifyUserModalOpen && (
        <ModifyUser
          onClose={closeModifyUserModal}
          userID={selectedUserId}
          onSuccess={handleModifySuccess}
        />
      )}
      {isArchiveUserModalOpen && (
        <ArchiveUser
          onClose={closeArchiveUserModal}
          userID={selectedUserId}
          onSuccess={handleArchiveSuccess}
        />
      )}
      {isDeleteUserModalOpen && (
        <DeleteUser
          onClose={closeDeleteUserModal}
          userID={selectedUserId}
          onSuccess={handleDeleteUser}
        />
      )}
      {isUnarchiveUserModalOpen && (
        <UnarchiveUser
          userId={selectedUserId}
          onClose={closeUnarchiveUserModal}
          onSuccess={handleUnarchiveSuccess}
        />
      )}
      {selectedUserDetails && (
        <UserDetails
          user={selectedUserDetails}
          onClose={() => setSelectedUserDetails(null)}
        />
      )}
      {isUploadModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsUploadModalOpen(false);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-[32rem] max-w-[90vw] relative shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[#062341] mb-4">Upload Credentials</h2>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Upload an Excel file containing user credentials:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 mb-4">
                <li>Column A: Check ID (e.g., 1313001)</li>
                <li>Column B: Role (student/teacher)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                disabled={isUploading}
              />

              {uploadError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {uploadError}
                </div>
              )}

              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-[#0B6EC9]">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaSpinner className="text-xl" />
                  </motion.div>
                  <span>Uploading...</span>
                </div>
              )}

              {uploadSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FaUserCheck />
                    <span>Upload successful!</span>
                  </div>
                  {uploadStats && (
                    <div className="text-sm text-gray-600 mt-1">
                      <p>New records added: {uploadStats.added}</p>
                      {uploadStats.skipped > 0 && (
                        <p>Skipped (already exists): {uploadStats.skipped}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                disabled={isUploading}
                className="px-4 py-2 bg-[#0B6EC9] text-white rounded-lg hover:bg-[#095396] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <FaFileUpload />
                Select File
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserManagement;
