const UploadModal = ({
  toggleUploadModal,
  inputFileRef,
  uploadImage,
  uploading,
  handleFileChange,
  isFileSelected,
}) => {
  return (
    <div className="h-[100vh] w-[2000px] absolute flex justify-center items-center">
      <div className="absolute bg-black opacity-75 h-[100%] w-[100%] z-10"></div>
      <form
        onSubmit={uploadImage}
        className="flex flex-col bg-[#dfecf6] w-[25%] h-[25%] z-20 rounded-[20px] pt-[10px] justify-center items-center gap-[20px]"
      >
        <div className="font-[sans-serif] max-w-md mx-auto">
          <label className="text-base text-[#062341] font-semibold mb-2 block">
            Set Profile Picture
          </label>
          <input
            onChange={handleFileChange}
            name="file"
            ref={inputFileRef}
            type="file"
            required
            className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-[#062341] rounded"
          />
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG SVG, WEBP, and GIF are Allowed.
          </p>
        </div>
        <div className="flex gap-[20%]">
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-lg w-[200px] text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 ${
              !uploading && isFileSelected
                ? "hover:bg-transparent hover:text-blue-700 transition-all duration-300"
                : "bg-blue-300"
            }  text-white `}
            disabled={uploading || !isFileSelected}
          >
            {uploading ? (
              <div
                aria-label="Loading..."
                role="status"
                className="flex items-center space-x-2"
              >
                <svg
                  className="h-[20px] w-[20px] animate-spin stroke-[#dfecf6]"
                  viewBox="0 0 256 256"
                >
                  <line
                    x1="128"
                    y1="32"
                    x2="128"
                    y2="64"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="60.1"
                    x2="173.3"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="224"
                    y1="128"
                    x2="192"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="195.9"
                    y1="195.9"
                    x2="173.3"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="128"
                    y1="224"
                    x2="128"
                    y2="192"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="195.9"
                    x2="82.7"
                    y2="173.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="32"
                    y1="128"
                    x2="64"
                    y2="128"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                  <line
                    x1="60.1"
                    y1="60.1"
                    x2="82.7"
                    y2="82.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  ></line>
                </svg>
                <span className="text-sm font-medium text-[#dfecf6]">
                  Uploading...
                </span>
              </div>
            ) : (
              "Upload"
            )}
          </button>
          <button
            onClick={toggleUploadModal}
            type="button"
            className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-[#66a8ee] hover:bg-transparent text-white hover:text-blue-700 transition-all duration-300"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadModal;
