import React from "react";

const ReportResult = ({ reportData, onClose }) => {
  if (!reportData) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-75">
      <div className="bg-white rounded-lg p-8 max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-3xl font-bold text-[#062341] mb-6">
          Generated Report
        </h2>
        {reportData.map((report, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-2xl font-semibold text-[#0B6EC9] mb-4">
              {Object.keys(report)[0].charAt(0).toUpperCase() +
                Object.keys(report)[0].slice(1)}{" "}
              Report
            </h3>
            <pre className="bg-[#F0F7FF] p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        ))}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-[#062341] text-white rounded-md hover:bg-[#0B6EC9] transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReportResult;
