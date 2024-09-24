const OpenLogout = ({ setisLogoutToggled, logout }) => {
  return (
    <div className="absolute w-[300px] z-10 right-1 top-20 rounded-[20px] shadow-lg">
      <div className="relative p-6 text-center bg-white rounded-lg dark:bg-gray-800">
        <p className="mb-6 text-gray-700 dark:text-gray-300 font-medium">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setisLogoutToggled(false)}
            className="py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 focus:outline-none transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenLogout;
