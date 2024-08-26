import Image from "next/image";
import background from "@/public/background.png";

const Background = () => {
  const responsive =
    "h-[50vh] top-[10%] lg:top-20 lg:h-[80vh] lg:translate-y-[-5px]";

  return (
    <Image
      alt="ctuBackground"
      src={background}
      className={`absolute w-full ${responsive}`}
    />
  );
};

export default Background;
