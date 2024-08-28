import { useEffect, useState } from "react";
import LoadingSpinner from "../../UI/loadingSpinner";

const RecordedAppraisal = ({
  setAppraisalModal,
  setRecentAppraisal,
  appraisalModal,
  recentAppraisal,
}) => {
  const [recordedAppraisal, setRecordedAppraisal] = useState([]);
  const [retrievingAppraisal, setRetrievingAppraisal] = useState(false);

  const fetchAppraisals = async () => {
    setRetrievingAppraisal(true);
    try {
      const response = await fetch("/api/retrieveAppraisal");
      const result = await response.json();

      setRecordedAppraisal(result.appraisal);
    } catch (error) {}

    setRetrievingAppraisal(false);
  };

  const retrieveScores = async (id) => {};

  useEffect(() => {
    fetchAppraisals();
  }, []);

  return (
    <>
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
        <div className="2xl:h-[80%] 2xl:w-[80%] bg-[#74afee] flex flex-col">
          {retrievingAppraisal && !recordedAppraisal ? (
            <LoadingSpinner />
          ) : (
            recordedAppraisal.map((appraisal) => (
              <div
                onClick={() => retrieveScores(appraisal.id)}
                className="w-[100%] 2xl:h-[60px] bg-white flex justify-evenly items-center cursor-pointer"
              >
                <span>{appraisal.id}</span>
                <span>{appraisal.date}</span>
                <span>{(appraisal.overallAverage / 5) * 100}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default RecordedAppraisal;
