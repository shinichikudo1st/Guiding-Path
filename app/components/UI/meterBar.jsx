const MeterBar = ({ percent }) => {
  return (
    <div className="w-[70%] bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-blue-600 h-2.5 rounded-full w-[50%]"></div>
    </div>
  );
};

export default MeterBar;
