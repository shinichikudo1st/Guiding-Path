import { useEffect, useState, useRef } from "react";
import {
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaIdCard,
  FaPhone,
} from "react-icons/fa";
import LoadingSpinner from "../../UI/loadingSpinner";
import EditModalCounselor from "../modals/editModalCounselor";
import UploadProfilePicture from "../../student/uploadProfilePicture";
import UploadModal from "../../student/modals/uploadModal";
import { decrypt, encrypt } from "@/app/utils/security";

const ProfileCounselor = () => {
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

  /**
   *
   * uploadImage function checks first if there is a profile picture
   * present and proceeds to delete the existing url in the database and the file in the
   * vercel blob storage. After deleting the existing profile, it uploads the new file
   * in the blob storage and updates the url field in the database.
   *
   */
  const uploadImage = async (event) => {
    event.preventDefault();

    setUploading(true);

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
    retrieveProfile();
    setUploading(false);
  };

  const retrieveProfile = async () => {
    setRetrievingData(true);
    try {
      const response = await fetch("/api/retrieveProfile");

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const result = await response.json();
      console.log(result.message);
      setProfileData(result.userInfo);

      const encryptedProfileData = encrypt(result.userInfo);
      if (encryptedProfileData) {
        sessionStorage.setItem("profileData", encryptedProfileData);
        //console.log("Profile data encrypted and stored");
      }
      setRetrievingData(false);
    } catch (error) {}
  };

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("profileData");
    if (storedProfile) {
      const decryptedProfileData = decrypt(storedProfile);
      if (decryptedProfileData) {
        setProfileData(decryptedProfileData);
        setRetrievingData(false);
      } else {
        retrieveProfile();
      }
    } else {
      retrieveProfile();
    }
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
          setUploadModal={setUploadModal}
          setIsFileSelected={setIsFileSelected}
        />
      )}
      <div className="absolute bg-gradient-to-br from-[#f0f8ff] to-[#e6f2ff] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col justify-center items-center shadow-lg">
        {editModal && (
          <EditModalCounselor
            editButton={editButton}
            profileData={profileData}
            retrieveProfile={retrieveProfile}
          />
        )}
        {retrievingData ? (
          <LoadingSpinner />
        ) : (
          profileData && (
            <div className="h-[90%] w-[90%] flex flex-col pl-[30%] text-[#062341] gap-[10%]">
              <UploadProfilePicture
                toggleUploadModal={toggleUploadModal}
                picture={
                  profileData.profilePicture !== ""
                    ? profileData.profilePicture
                    : null
                }
              />
              <span className="text-[28pt] font-bold text-[#062341]">
                MY PROFILE
              </span>
              <div className="flex gap-[10px] text-[16pt] 2xl:w-[90%] items-center">
                <FaUser className="text-[#0B6EC9] text-xl" />
                <label htmlFor="name" className="font-semibold 2xl:w-[25%]">
                  Name:
                </label>
                <span className="font-medium">{profileData.name}</span>
              </div>
              <div className="flex gap-[10px] text-[16pt] 2xl:w-[90%] items-center">
                <FaBuilding className="text-[#0B6EC9] text-xl" />
                <label htmlFor="name" className="font-semibold 2xl:w-[25%]">
                  Department:
                </label>
                <span className="font-medium">{profileData.department}</span>
              </div>
              <div className="flex gap-[10px] text-[16pt] 2xl:w-[90%] items-center">
                <FaIdCard className="text-[#0B6EC9] text-xl" />
                <label htmlFor="name" className="font-semibold 2xl:w-[25%]">
                  ID Number:
                </label>
                <span className="font-medium">{profileData.idNumber}</span>
              </div>
              <div className="flex gap-[10px] text-[16pt] 2xl:w-[90%] items-center">
                <FaPhone className="text-[#0B6EC9] text-xl" />
                <label htmlFor="name" className="font-semibold 2xl:w-[25%]">
                  Contact:
                </label>
                <span className="font-medium">{profileData.contact}</span>
              </div>
              <div className="flex gap-[10%] 2xl:mt-[10%]">
                <button
                  onClick={editButton}
                  className="text-white bg-[#0B6EC9] hover:bg-[#095396] focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[35%] h-[50px] transition duration-300 ease-in-out flex items-center justify-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={backButton}
                  className="text-[#062341] bg-[#E6F0F9] hover:bg-[#C4E0F9] focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 hover:text-[#062341] dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[35%] h-[50px] transition duration-300 ease-in-out flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ProfileCounselor;
