const OpenLogout = ({ setisLogoutToggled, logout }) => {
  return (
    <div className="absolute w-[300px] z-10 right-1 top-20 rounded-[20px]">
      <div className="relative p-4 text-center bg-[#f8f9fa] rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <p className="mb-4 text-gray-500 dark:text-gray-300">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center items-center space-x-4 ">
          <button
            onClick={() => setisLogoutToggled(false)}
            className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            No, cancel
          </button>
          <button
            onClick={logout}
            className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenLogout;
