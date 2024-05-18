import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";

const LoginModal = ({ login }) => {
  return (
    <>
      <div className="absolute bottom-5 right-44 bg-[#F3F8FC] w-[33%] h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5">
        <Image src={ctuLogo} className="w-[80px] h-[80px]" />
        <div className="flex flex-col items-center">
          <span className="text-[#062341] text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341]">Login existing account</span>
        </div>
        <form action="" className="flex flex-col items-center gap-5">
          <input
            type="text"
            placeholder="Email"
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="text"
            placeholder="Password"
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <button
            type="submit"
            className="bg-[#0B6EC9] w-[200px] h-[40px] mt-5 rounded-[10px] font-bold"
          >
            Login
          </button>
        </form>
        <span className=" text-[#818487] text-sm mt-3">
          Dont have an account?{" "}
          <u className=" text-[#0A72D1] cursor-pointer font-semibold">
            Signup Now
          </u>
        </span>
      </div>

      <div className="absolute bottom-5 right-44 bg-[#F3F8FC] w-[33%] h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 translate-x-[-1300px]">
        <Image src={ctuLogo} className="w-[80px] h-[80px]" />
        <div className="flex flex-col items-center">
          <span className="text-[#062341] text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341]">Create an account</span>
        </div>
        <form action="" className="flex flex-col items-center gap-2">
          <input
            type="text"
            placeholder="ID Number"
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="email"
            placeholder="Email"
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="text"
            placeholder="Contact No."
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <button
            type="submit"
            className="bg-[#0B6EC9] w-[200px] h-[40px] rounded-[10px] mt-2 font-bold"
          >
            Create Account
          </button>
        </form>
        <span className=" text-[#818487] text-sm mt-1">
          Already have an existing account?{" "}
          <u className=" text-[#0A72D1] cursor-pointer font-semibold">Login</u>
        </span>
      </div>
    </>
  );
};

export default LoginModal;
