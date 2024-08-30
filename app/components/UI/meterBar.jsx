const MeterBar = ({ color, width }) => {
  return (
    <div className="w-[70%] bg-gray-300 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`${color} h-2.5 rounded-full w-[${width}%]`}></div>
    </div>
  );
};

export default MeterBar;
