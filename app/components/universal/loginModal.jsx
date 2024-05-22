import Image from "next/image";
import ctuLogo from "@/public/ctuLogo.png";
import { useRouter } from "next/navigation";

const LoginModal = ({ login, signup }) => {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/pages/studentDashboard");
  };

  return (
    <>
      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[33%] h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 lg:translate-y-[-20px] ${
          login
            ? "translate-x-0 ease-in duration-[0.2s]"
            : "translate-x-[700px] lg:translate-x-[1000px] ease-out duration-[0.2s]"
        }`}
      >
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
            name="email"
            required
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className=" h-[50px] w-[300px] p-[10px] text-[#062341] outline-none bg-transparent border-b-2 border-[#062341]"
          />
          <button
            onClick={handleSubmit}
            className="bg-[#0B6EC9] w-[200px] h-[40px] mt-5 rounded-[10px] font-bold 2xl:mt-[100px]"
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

      <div
        className={`absolute bottom-5 right-44 bg-[#F3F8FC] w-[33%] h-[75vh] rounded-[10px] flex flex-col items-center p-5 gap-5 lg: lg:translate-y-[-20px] ${
          signup
            ? "lg:translate-x-[-600px] 2xl:translate-x-[-900px] ease-in duration-[0.2s]"
            : "lg:translate-x-[-1300px] 2xl:translate-x-[-1800px] ease-out duration-[0.2s]"
        }`}
      >
        <Image src={ctuLogo} className="w-[80px] h-[80px]" />
        <div className="flex flex-col items-center">
          <span className="text-[#062341] text-[20pt] font-bold">
            GUIDING PATH
          </span>
          <span className="text-[#062341]">Create an account</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2"
        >
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
          <button className="bg-[#0B6EC9] w-[200px] h-[40px] rounded-[10px] mt-2 font-bold 2xl:mt-10">
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
