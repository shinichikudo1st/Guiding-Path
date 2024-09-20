import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import PaginationButton from "../../UI/paginationButton";
import { useEffect, useState } from "react";
import { FaGears, FaUserLargeSlash, FaUserXmark } from "react-icons/fa6";
import Image from "next/image";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const retrieveUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getAllUser?page=${currentPage}`);
      const result = await response.json();

      setUsers(result.users);
      setTotalPages(result.totalPages);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
        <div className="h-[60%] w-[90%] bg-[#D8E8F6] border-[1px] border-[#062341]">
          {loading ? (
            <div className="flex items-center justify-center w-[100%] h-[100%] rounded-lg bg-[#D8E8F6] dark:bg-gray-800 dark:border-gray-700">
              <div className="px-3 py-1 text-[15pt] font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                Loading Users...
              </div>
            </div>
          ) : (
            users &&
            users.map((user) => (
              <div
                key={user.user_id}
                className="flex w-[100%] h-[20%] border-y-[1px] border-[#062341]"
              >
                <div className="flex gap-[10%] items-center pl-[2%] w-[40%]">
                  <Image
                    alt={"profilePicture"}
                    src={user.profilePicture}
                    width={80}
                    height={80}
                    className="bg-red-600 rounded-[999px] w-[80px] h-[80px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[12pt] text-[#062341] font-bold">
                      {user.name}
                    </span>
                    <span className="text-[10pt] text-[#A8AFB5]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="w-[20%] flex justify-center items-center">
                  <span className="flex justify-center items-center font-semibold text-[#062341] bg-[#97C9F5] w-[80%] h-[60%] rounded-[20px]">
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-evenly items-center w-[40%] text-[#1F5B9B]">
                  <div className="flex h-[50%] justify-center items-center gap-[10%] hover:text-[#127cee] duration-[0.3s] cursor-pointer">
                    <FaGears className="text-[30pt]" />
                    <span className="font-bold">Modify</span>
                  </div>
                  <div className="flex h-[50%] justify-center items-center gap-[10%] hover:text-[#127cee] duration-[0.3s] cursor-pointer">
                    <FaUserLargeSlash className="text-[30pt]" />
                    <span className="font-bold">Remove</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <PaginationButton nextPage={nextPage} previousPage={previousPage} />
      </div>
    </>
  );
};

export default UserManagement;
