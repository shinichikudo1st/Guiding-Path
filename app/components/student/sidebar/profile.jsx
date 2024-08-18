import { useEffect, useState } from "react";
import LoadingSpinner from "../../UI/loadingSpinner";

const Profile = () => {
  const [retrievingData, setRetrievingData] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const retrieveProfile = async () => {
    setRetrievingData(!retrievingData);

    const response = await fetch("/api/retrieveProfile");
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col justify-center items-center">
        {retrievingData ? (
          <LoadingSpinner />
        ) : (
          <div className="h-[90%] w-[90%] flex flex-col pl-[18%] text-[#1f3a56] gap-[30px]">
            <span className="text-[25pt] font-bold">MY PROFILE</span>
            <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
              <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                Name:
              </label>
              <span>Vaughn Andre Pablo</span>
            </div>
            <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
              <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                Year:
              </label>
              <span>4th Year</span>
            </div>
            <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
              <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                Course:
              </label>
              <span>Bachelor of Science in Information Systems</span>
            </div>
            <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
              <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                ID Number:
              </label>
              <span>1313280</span>
            </div>
            <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
              <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                Contact:
              </label>
              <span>09164906284</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
