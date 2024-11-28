import { useEffect, useState, useRef } from "react";
import {
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaGraduationCap,
  FaBook,
  FaIdCard,
  FaPhone,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import EditModal from "../modals/editModal";
import UploadProfilePicture from "../uploadProfilePicture";
import UploadModal from "../modals/uploadModal";
import { encrypt, decrypt } from "@/app/utils/security";
import { motion } from "framer-motion";

const Profile = () => {
  const [retrievingData, setRetrievingData] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [quote, setQuote] = useState({ text: "", author: "" });
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
    } catch (error) {
      console.error("Error retrieving profile:", error);
      setRetrievingData(false);
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const response = await fetch(
        "https://api.quotable.io/random?tags=inspirational,motivation"
      );
      const data = await response.json();
      setQuote({ text: data.content, author: data.author });
    } catch (error) {
      setQuote({
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      });
    }
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
    fetchDailyQuote();
  }, []);

  const profileItems = [
    { icon: FaUser, label: "Name", value: profileData?.name },
    { icon: FaGraduationCap, label: "Year", value: profileData?.year },
    { icon: FaBook, label: "Course", value: profileData?.course },
    { icon: FaBook, label: "Department", value: profileData?.department },
    { icon: FaIdCard, label: "ID Number", value: profileData?.idNumber },
    { icon: FaPhone, label: "Contact", value: profileData?.contact },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 md:pt-24 pb-8 px-4 md:px-6 overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto lg:ml-72 lg:mr-72 2xl:mx-auto space-y-6 md:space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4 md:p-8 text-white">
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              My Profile
            </h1>
          </div>

          <div className="p-4 md:p-10 bg-white">
            <div className="flex justify-center mb-6 md:mb-10">
              <UploadProfilePicture
                toggleUploadModal={toggleUploadModal}
                picture={profileData?.profilePicture || null}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4">
              {profileItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-3 md:p-4 shadow-md border border-[#0B6EC9]/10 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center shadow-sm">
                      <item.icon className="text-white text-base md:text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs text-[#062341]/70 font-medium">
                        {item.label}
                      </label>
                      <p className="text-[#062341] font-semibold text-sm truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={editButton}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-semibold hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md text-sm md:text-base"
              >
                <FaEdit className="text-lg" />
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={backButton}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-white text-[#062341] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all duration-300 border border-[#0B6EC9]/20 shadow-md text-sm md:text-base"
              >
                <FaArrowLeft className="text-lg" />
                Back
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-[#0B6EC9]/10 overflow-hidden p-4 md:p-6"
        >
          <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
            <h2 className="text-base md:text-lg font-bold text-[#0B6EC9]">
              Daily Inspiration
            </h2>
            <div className="relative max-w-2xl">
              <FaQuoteLeft className="absolute -top-2 -left-2 md:-top-3 md:-left-3 text-[#0B6EC9]/20 text-xl md:text-2xl" />
              <p className="text-sm md:text-base text-[#062341] font-medium px-4 md:px-6 py-2">
                {quote.text}
              </p>
              <FaQuoteRight className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 text-[#0B6EC9]/20 text-xl md:text-2xl" />
            </div>
            <p className="text-xs md:text-sm text-[#062341]/70 font-medium">
              ― {quote.author}
            </p>
          </div>
        </motion.div>
      </div>

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
      {editModal && (
        <EditModal
          editButton={editButton}
          profileData={profileData}
          retrieveProfile={retrieveProfile}
        />
      )}
    </motion.div>
  );
};

export default Profile;
