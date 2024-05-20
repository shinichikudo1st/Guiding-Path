import { BsBellFill, BsGearFill } from "react-icons/bs";

const StudentNavbar = () => {
  const iconSize = "text-[20pt]  cursor-pointer";

  return (
    <nav className="absolute w-full h-[10vh] flex items-center justify-between px-5 2xl:h-[15.5vh]">
      <h1 className=" text-[#062341] font-bold text-[25pt]">Guiding Path</h1>
      <div className="flex w-[40%] h-[10vh] justify-center items-center gap-8 text-[#062341]">
        <BsBellFill className={iconSize} />
        <BsGearFill className={iconSize} />
        <span className="text-[16pt] font-bold translate-x-[60px] cursor-pointer">
          LOGOUT
        </span>
      </div>
    </nav>
  );
};

export default StudentNavbar;
