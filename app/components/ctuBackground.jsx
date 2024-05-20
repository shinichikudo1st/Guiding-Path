import Image from "next/image";
import background from "@/public/background.png";

const Background = () => {
  return (
    <Image
      alt="ctuBackground"
      src={background}
      className="absolute w-full h-[75vh] top-20 translate-y-5 lg:h-[80vh]"
    />
  );
};

export default Background;
