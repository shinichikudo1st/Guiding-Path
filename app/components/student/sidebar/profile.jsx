import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../../UI/loadingSpinner";
import EditModal from "../modals/editModal";
import UploadProfilePicture from "../uploadProfilePicture";
import UploadModal from "../modals/uploadModal";

const Profile = () => {
  const [retrievingData, setRetrievingData] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const inputFileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = () => {
    const file = inputFileRef.current?.files[0];
    setIsFileSelected(!!file);
  };

  const toggleUploadModal = () => {
    setUploadModal(!uploadModal);
  };

  const editButton = () => {
    setEditModal(!editModal);
  };

  const backButton = () => {};

  const uploadImage = async (event) => {
    event.preventDefault();

    setUploading(!uploading);

    if (profileData.profilePicture) {
      try {
        const url = profileData.profilePicture;
        const deletePicture = await fetch("/api/deleteProfile", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        const deleteResult = await deletePicture.json();
        console.log(deleteResult.message);
      } catch (error) {}
    }

    const file = inputFileRef.current.files[0];

    if (!file) {
      console.log("No file detected");
      return;
    }

    try {
      const response = await fetch(`/api/uploadProfile?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {}

    toggleUploadModal();
    setUploading(!uploading);
    window.location.reload();
  };

  const retrieveProfile = async () => {
    try {
      const response = await fetch("/api/retrieveProfile");

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const result = await response.json();
      console.log(result.message);
      setProfileData(result.userInfo);
      setRetrievingData(!retrievingData);
    } catch (error) {}
  };

  useEffect(() => {
    retrieveProfile();
  }, []);

  return (
    <>
      {uploadModal && (
        <UploadModal
          toggleUploadModal={toggleUploadModal}
          inputFileRef={inputFileRef}
          uploadImage={uploadImage}
          uploading={uploading}
          handleFileChange={handleFileChange}
          isFileSelected={isFileSelected}
        />
      )}
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col justify-center items-center">
        {editModal && (
          <EditModal
            editButton={editButton}
            profileData={profileData}
            retrieveProfile={retrieveProfile}
          />
        )}
        {retrievingData ? (
          <LoadingSpinner />
        ) : (
          profileData && (
            <div className="h-[90%] w-[90%] flex flex-col pl-[30%] text-[#1f3a56] gap-[50px]">
              <UploadProfilePicture
                toggleUploadModal={toggleUploadModal}
                picture={
                  profileData.profilePicture !== ""
                    ? profileData.profilePicture
                    : null
                }
              />
              <span className="text-[25pt] font-bold">MY PROFILE</span>
              <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
                <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                  Name:
                </label>
                <span>{profileData.name}</span>
              </div>
              <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
                <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                  Year:
                </label>
                <span>{profileData.year}</span>
              </div>
              <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
                <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                  Course:
                </label>
                <span>{profileData.course}</span>
              </div>
              <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
                <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                  ID Number:
                </label>
                <span>{profileData.idNumber}</span>
              </div>
              <div className="flex gap-[10px] text-[15pt] 2xl:w-[90%]">
                <label htmlFor="name" className="font-bold 2xl:w-[25%]">
                  Contact:
                </label>
                <span>{profileData.contact}</span>
              </div>
              <div className="flex gap-[10%] 2xl:mt-[10%]">
                <button
                  onClick={editButton}
                  className="text-white bg-[#0B6EC9] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[35%] h-[50px]"
                >
                  Edit
                </button>
                <button
                  onClick={backButton}
                  className="text-[#1f3a56] bg-[#8BB8E1] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 hover:text-white dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[35%] h-[50px]"
                >
                  Back
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Profile;
