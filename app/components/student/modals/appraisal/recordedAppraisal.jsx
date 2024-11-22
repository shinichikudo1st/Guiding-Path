import { useEffect, useState } from "react";
import LoadingSpinner from "../../../UI/loadingSpinner";
import ViewScore from "./viewScore";
import { decrypt, encrypt } from "@/app/utils/security";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaChartLine } from "react-icons/fa";

const RecordedAppraisal = () => {
  const [recordedAppraisal, setRecordedAppraisal] = useState([]);
  const [retrievingAppraisal, setRetrievingAppraisal] = useState(false);
  const [areaScores, setAreaScores] = useState(null);
  const [openScore, setOpenScore] = useState(false);

  const fetchAppraisals = async () => {
    setRetrievingAppraisal(true);
    try {
      const response = await fetch("/api/retrieveAppraisal");
      const result = await response.json();
      setRecordedAppraisal(result.appraisal);
      const encryptedAppraisal = encrypt(result.appraisal);
      sessionStorage.setItem("recordedAppraisal", encryptedAppraisal);
    } catch (error) {
      console.error("Error fetching appraisals:", error);
    }
    setRetrievingAppraisal(false);
  };

  const toggleResult = () => {
    setOpenScore(!openScore);
  };

  const retrieveScores = async (id) => {
    try {
      const response = await fetch(`/api/retrieveScore?id=${id}`);
      const result = await response.json();
      setAreaScores(result.score);
    } catch (error) {
      console.error("Error retrieving scores:", error);
    }
    toggleResult();
  };

  useEffect(() => {
    const sessionCache = sessionStorage.getItem("recordedAppraisal");
    if (sessionCache) {
      const decryptedAppraisal = decrypt(sessionCache);
      if (decryptedAppraisal) {
        setRecordedAppraisal(decryptedAppraisal);
      } else {
        fetchAppraisals();
      }
    } else {
      fetchAppraisals();
    }
  }, []);

  return (
    <>
      {openScore && <ViewScore areaScores={areaScores} close={toggleResult} />}
      <div className="space-y-6">
        {retrievingAppraisal ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingSpinner />
          </div>
        ) : recordedAppraisal && recordedAppraisal.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {recordedAppraisal.map((appraisal, index) => (
              <motion.div
                key={appraisal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => retrieveScores(appraisal.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-[#0B6EC9]/10 overflow-hidden"
              >
                <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">
                        {new Date(appraisal.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <FaCalendarAlt className="text-[#0B6EC9]" />
                      <p className="text-lg font-semibold text-[#062341]">
                        {new Date(appraisal.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <FaChartLine className="text-[#0B6EC9]" />
                      <span className="text-sm font-medium text-[#062341]/70">
                        Overall Score:{" "}
                        <span className="text-green-600">
                          {((appraisal.overallAverage / 5) * 100).toFixed(1)}%
                        </span>
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-full text-sm font-medium hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center mb-4 shadow-md opacity-50">
              <FaChartLine className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#062341]">
              No Appraisals Found
            </h3>
            <p className="text-sm text-[#062341]/70 mt-2">
              Start a new appraisal to see your results here
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RecordedAppraisal;
