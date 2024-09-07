import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";

const UserManagement = () => {
  return (
    <>
      <div className="absolute bg-[#dfecf6] 2xl:w-[55%] 2xl:h-[80%] 2xl:translate-x-[41%] 2xl:translate-y-[20%] rounded-[20px] flex flex-col items-center">
        <div className="flex items-center justify-between w-[100%] h-[15%] px-[5%]">
          <span className="text-[25pt] font-sans font-bold select-none">
            User Management
          </span>
          <div className="flex justify-between w-[50%]">
            <button className="w-[30%] text-[#062341] border-[2px] border-[#062341] bg-transparent hover:bg-[#1F5B9B] hover:text-white font-medium text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Select Role
              <IoMdArrowDropdown />
            </button>
            <form className="w-[65%]">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <IoMdSearch />
                </div>
                <input
                  type="search"
                  id="search"
                  name="search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border-[2px] border-[#062341] bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search Name"
                  required
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex h-[8%] w-[90%]">
          <span className="w-[35%] flex pl-[10%] items-center text-[12pt] font-bold">
            Name
          </span>
          <span className="w-[30%] flex justify-center items-center text-[12pt] font-bold">
            User Role
          </span>
          <span className="w-[35%] flex justify-center items-center text-[12pt] font-bold">
            Manage
          </span>
        </div>
        <div className="h-[60%] w-[90%] bg-[#D8E8F6] border-[1px] border-[#062341]"></div>
      </div>
    </>
  );
};

export default UserManagement;
