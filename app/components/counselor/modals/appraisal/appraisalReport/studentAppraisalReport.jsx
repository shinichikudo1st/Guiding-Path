import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { FaSearch, FaChartBar } from "react-icons/fa";
import StudentAppraisalDetail from "./studentAppraisalDetail";

const StudentAppraisalReport = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchStudents = async (searchTerm = "", page = 1) => {
    try {
      const response = await fetch(
        `/api/appraisal/studentAppraisal?search=${searchTerm}&page=${page}&limit=6`
      );
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    setSearchTimeout(
      setTimeout(() => {
        fetchStudents(value, 1);
      }, 500)
    );
  };

  const getAverageScore = (appraisals) => {
    const allScores = appraisals.flatMap((appraisal) =>
      appraisal.categoryResponses.map((cr) => cr.score)
    );
    return allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 4.0) return "bg-lime-300";
    if (score >= 3.0) return "bg-yellow-500";
    if (score >= 2.0) return "bg-orange-500";
    return "bg-red-500";
  };

  if (selectedStudent) {
    return (
      <StudentAppraisalDetail
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search students..."
            className="w-full px-4 py-3 pl-12 rounded-xl border border-[#0B6EC9]/10 focus:border-[#0B6EC9] focus:ring-1 focus:ring-[#0B6EC9] transition-all duration-300 outline-none"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Student List */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B6EC9]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((student) => (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={student.student.profilePicture || "/noProfile.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-[#0B6EC9]"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-[#062341]">
                      {student.student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {student.student.email}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaChartBar className="text-[#0B6EC9]" />
                        <span className="text-sm text-gray-600">
                          {student.appraisals.length} Appraisals
                        </span>
                      </div>
                      {student.appraisals.length > 0 && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            getAverageScore(student.appraisals)
                          )} text-white`}
                        >
                          {getAverageScore(student.appraisals).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudent(student)}
                  className="w-full mt-4 px-4 py-2 bg-[#0B6EC9]/10 text-[#0B6EC9] rounded-lg hover:bg-[#0B6EC9] hover:text-white transition-all duration-300"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && students.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchStudents(search, currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <IoChevronBackOutline />
            </button>
            <button
              onClick={() => fetchStudents(search, currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAppraisalReport;
