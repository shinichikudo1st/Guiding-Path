const Navbar = ({ login, signup }) => {
  const responsive = "h-[10vh] lg:h-[10vh] 2xl:h-[8vh]";

  const buttonProperty =
    "w-[150px] text-[10pt] 2xl:text-[15pt] font-bold text-[#062341] rounded-[10px] ";

  return (
    <nav
      className={`absolute w-full flex items-center justify-between px-5 ${responsive}`}
    >
      <h1 className=" text-[#062341] font-bold text-[15pt] 2xl:text-[25pt]">
        Guiding Path
      </h1>
      <div className="flex w-[30%] 2xl:h-[10vh] justify-center gap-3">
        <button className={buttonProperty} onClick={login}>
          Login
        </button>
        <button className={buttonProperty} onClick={signup}>
          Signup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
