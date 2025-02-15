import { useEffect, useState, useRef } from "react";
import {
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaIdCard,
  FaPhone,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import EditModalCounselor from "../modals/editModalCounselor";
import UploadProfilePicture from "../../student/uploadProfilePicture";
import UploadModal from "../../student/modals/uploadModal";
import { decrypt, encrypt } from "@/app/utils/security";
import { motion } from "framer-motion";

const ProfileCounselor = () => {
  const [retrievingData, setRetrievingData] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const inputFileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [quote, setQuote] = useState({ text: "", author: "" });

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-24 pb-8 px-4 sm:px-6"
      style={{ marginLeft: "16rem", marginRight: "16rem" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-8 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold text-center">
              My Profile
            </h1>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-10">
              <UploadProfilePicture
                toggleUploadModal={toggleUploadModal}
                picture={profileData?.profilePicture || null}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: FaUser, label: "Name", value: profileData?.name },
                {
                  icon: FaBuilding,
                  label: "Department",
                  value: profileData?.department,
                },
                {
                  icon: FaIdCard,
                  label: "ID Number",
                  value: profileData?.idNumber,
                },
                {
                  icon: FaPhone,
                  label: "Contact",
                  value: profileData?.contact,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B6EC9] to-[#095396] rounded-lg flex items-center justify-center shadow-sm">
                      <item.icon className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-[#062341]/70 font-medium">
                        {item.label}
                      </label>
                      <p className="text-[#062341] font-semibold text-xl">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={editButton}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B6EC9] to-[#095396] text-white rounded-xl font-semibold hover:from-[#095396] hover:to-[#084B87] transition-all duration-300 shadow-md"
              >
                <FaEdit className="text-lg" />
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={backButton}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#062341] rounded-xl font-semibold hover:bg-[#F8FAFC] transition-all duration-300 border border-[#0B6EC9]/20 shadow-sm"
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
          className="bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden p-6"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-lg font-bold text-[#0B6EC9]">
              Daily Inspiration
            </h2>
            <div className="relative max-w-2xl">
              <FaQuoteLeft className="absolute -top-3 -left-3 text-[#0B6EC9]/20 text-2xl" />
              <p className="text-base text-[#062341] font-medium px-6 py-2">
                {quote.text}
              </p>
              <FaQuoteRight className="absolute -bottom-3 -right-3 text-[#0B6EC9]/20 text-2xl" />
            </div>
            <p className="text-sm text-[#062341]/70 font-medium">
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
        <EditModalCounselor
          editButton={editButton}
          profileData={profileData}
          retrieveProfile={retrieveProfile}
        />
      )}
    </motion.div>
  );
};

export default ProfileCounselor;
