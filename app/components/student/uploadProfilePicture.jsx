import noProfile from "@/public/noProfile.png";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";

const UploadProfilePicture = ({ toggleUploadModal, picture }) => {
  return (
    <div className="absolute left-[5%] top-[5%] 2xl:w-[25%] 2xl:h-[40%] flex flex-col items-center gap-[20px]">
      <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] 2xl:w-[250px] 2xl:h-[250px] overflow-hidden rounded-full shadow-lg border-4 border-white">
        <Image
          alt="Profile Picture"
          src={picture ? picture : noProfile}
          className="object-cover transition-transform duration-300 hover:scale-110"
          width={250}
          height={250}
          quality={75}
        />
      </div>
      <button
        onClick={toggleUploadModal}
        className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <FaRegEdit className="text-[30pt] text-blue-600" />
      </button>
    </div>
  );
};

export default UploadProfilePicture;
