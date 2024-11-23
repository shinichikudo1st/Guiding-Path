import Image from "next/image";
import background from "@/public/background.png";

const Background = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#D9E7F3]/30 to-[#F8FAFC]/30" />
      <Image
        alt="ctuBackground"
        src={background}
        className="object-cover w-full h-full"
        priority
        fill
        sizes="100vw"
        quality={100}
      />
    </div>
  );
};

export default Background;
