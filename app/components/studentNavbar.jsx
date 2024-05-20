const StudentNavbar = () => {
  const buttonProperty =
    "w-[150px] text-[15pt] font-bold text-[#062341] rounded-[10px] ";

  return (
    <nav className="absolute w-full h-[15.5vh] flex items-center justify-between px-5 lg:h-[10vh]">
      <h1 className=" text-[#062341] font-bold text-[25pt]">Guiding Path</h1>
      <div className="flex w-[30%] h-[10vh] justify-center gap-3">
        <button className={buttonProperty}>Login</button>
        <button className={buttonProperty}>Signup</button>
      </div>
    </nav>
  );
};

export default StudentNavbar;
