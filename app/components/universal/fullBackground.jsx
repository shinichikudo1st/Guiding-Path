import Image from "next/image";
import background from "@/public/background.png";

const FullBackground = () => {
  const responsive = "lg:top-20 lg:h-[90vh] lg:translate-y-[-5px]";

  return (
    <Image
      alt="ctuBackground"
      src={background}
      className={`absolute w-full ${responsive}`}
    />
  );
};

export default FullBackground;
