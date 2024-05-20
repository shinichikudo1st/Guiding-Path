const Introduction = ({ login, signup }) => {
  const responsive = "";

  return (
    <>
      <div
        className={` absolute flex flex-col w-[40%] h-[50vh] bottom-40 left-20 items-center justify-center gap-8 font-bold lg:translate-y-[20px] 2xl:translate-y-[-100px] text-[#f1f5fa] ${
          login
            ? "translate-x-0 ease-in duration-[0.2s]"
            : "translate-x-[-500px] lg:translate-x-[-700px] ease-out duration-[0.2s]"
        }`}
      >
        <h1 className=" text-[30pt]">Support at every step</h1>
        <p className=" text-justify font-normal text-[14pt]">
          Access our resources and guidance services <br />
          <br /> you need. Connect with qualified counselors <br />
          <br />
          and support groups.
        </p>
      </div>
      <div
        className={` absolute flex flex-col w-[40%] h-[50vh] bottom-40 left-20 items-center justify-center gap-8 font-bold  2xl:translate-y-[-100px] text-[#f1f5fa] ${
          signup
            ? "lg:translate-x-[700px] 2xl:translate-x-[1000px] ease-in duration-[0.2s]"
            : "lg:translate-x-[1300px] 2xl:translate-x-[1700px] ease-out duration-[0.2s]"
        }`}
      >
        <h1 className=" text-[30pt]">Create Account</h1>
        <p className=" text-justify font-normal text-[14pt]">
          Before accessing our services, you need
          <br />
          <br />
          to create an account. Enter required <br />
          <br />
          credentials and click "Signup" <br />
          <br />
          button below to create account
        </p>
      </div>
    </>
  );
};

export default Introduction;
