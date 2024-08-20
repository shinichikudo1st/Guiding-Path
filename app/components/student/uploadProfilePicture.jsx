import noProfile from "@/public/noProfile.png";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";

const UploadProfilePicture = ({ toggleUploadModal, picture }) => {
  const defaultWidth = 250;
  const defaultHeight = 250;

  return (
    <div className="absolute left-[5%] top-[5%] 2xl:w-[25%] 2xl:h-[25%] flex flex-col items-center gap-[20px]">
      <Image
        alt="Profile Picture"
        src={picture ? picture : noProfile}
        className=" rounded-full"
        width={defaultWidth}
        height={defaultHeight}
        quality={75}
      />
      <button onClick={toggleUploadModal}>
        <FaRegEdit className="text-[30pt]" />
      </button>
    </div>
  );
};

export default UploadProfilePicture;
