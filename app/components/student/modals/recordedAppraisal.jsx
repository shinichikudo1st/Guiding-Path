import { useEffect, useState } from "react";
import LoadingSpinner from "../../UI/loadingSpinner";
import ViewScore from "./viewScore";

const RecordedAppraisal = ({
  setAppraisalModal,
  setRecentAppraisal,
  appraisalModal,
  recentAppraisal,
}) => {
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
      sessionStorage.setItem(
        "recordedAppraisal",
        JSON.stringify(result.appraisal)
      );
    } catch (error) {}

    setRetrievingAppraisal(false);
  };

  const toggleResult = () => {
    setOpenScore(!openScore);
  };

  const retrieveScores = async (id) => {
    const sessionCache = sessionStorage.getItem("areaScores");
    if (sessionCache) {
      setAreaScores(JSON.parse(sessionCache));
    } else {
      try {
        const response = await fetch(`/api/retrieveScore?id=${id}`);
        const result = await response.json();

        setAreaScores(result.score);
        sessionStorage.setItem("areaScores", JSON.stringify(result.score));
      } catch (error) {}
    }
    toggleResult();
  };

  useEffect(() => {
    const sessionCache = sessionStorage.getItem("recordedAppraisal");
    if (sessionCache) {
      setRecordedAppraisal(JSON.parse(sessionCache));
    } else {
      fetchAppraisals();
    }
  }, []);

  return (
    <>
      {openScore && <ViewScore areaScores={areaScores} close={toggleResult} />}
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center pt-[3%] gap-[5%]">
        <div className="flex text-[#062341] text-[20pt] font-extrabold w-[50%] justify-evenly">
          <span
            onClick={() => {
              setAppraisalModal(false);
              setRecentAppraisal(true);
            }}
            className={`w-[50%] ${
              recentAppraisal ? "text-[#062341] underline" : "text-[#818487]"
            }  text-center border-r-[2px] border-[#062341] cursor-pointer`}
          >
            Past Appraisal
          </span>
          <span
            onClick={() => {
              setRecentAppraisal(false);
              setAppraisalModal(true);
            }}
            className={`w-[50%] ${
              appraisalModal ? "text-[#062341] underline" : "text-[#818487]"
            }  text-center border-l-[2px] border-[#062341] cursor-pointer`}
          >
            Start Appraisal
          </span>
        </div>
        <div className="2xl:h-[80%] 2xl:w-[80%] bg-white rounded-lg shadow-md overflow-hidden">
          {retrievingAppraisal ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner />
            </div>
          ) : recordedAppraisal && recordedAppraisal.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recordedAppraisal.map((appraisal) => (
                <div
                  key={appraisal.id}
                  onClick={() => retrieveScores(appraisal.id)}
                  className="p-6 hover:bg-blue-50 transition duration-300 ease-in-out cursor-pointer flex justify-between items-center border-l-4 border-blue-500 shadow-sm mb-4 rounded-lg"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">
                          {new Date(appraisal.date).getDate()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-1">
                        {new Date(appraisal.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                      Overall Score:{" "}
                      {((appraisal.overallAverage / 5) * 100).toFixed(1)}%
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No appraisals found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecordedAppraisal;
