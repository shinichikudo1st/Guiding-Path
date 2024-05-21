import { BsBellFill, BsGearFill } from "react-icons/bs";

const StudentNavbar = ({ logout }) => {
  const iconSize =
    "text-[20pt]  cursor-pointer 2xl:translate-x-[130px] hover:scale-110 hover:text-[#0B6EC9] hover:duration-[0.3s]";

  return (
    <nav className="absolute w-full h-[10vh] flex items-center justify-between px-5 2xl:h-[8vh]">
      <h1 className=" text-[#062341] font-bold text-[25pt]">Guiding Path</h1>
      <div className="flex w-[40%] h-[10vh] justify-center items-center gap-6 text-[#062341]">
        <BsBellFill className={iconSize} />
        <BsGearFill className={iconSize} />
        <span className="text-[16pt] font-bold translate-x-[60px] cursor-pointer 2xl:translate-x-[200px] hover:text-[#0B6EC9] hover:scale-105 hover:duration-[0.3s]">
          LOGOUT
        </span>
      </div>
    </nav>
  );
};

export default StudentNavbar;
