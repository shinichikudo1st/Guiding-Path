import {
  evaluateSocioEmotional,
  evaluateAcademic,
  evaluateCareer,
} from "@/app/utils/evaluate";
import { FaTimes, FaBook, FaSmile, FaBriefcase } from "react-icons/fa";
import MeterBar from "../../../UI/meterBar";

const ViewScore = ({ areaScores, close }) => {
  const academic = evaluateAcademic(areaScores.academic_score);
  const emotional = evaluateSocioEmotional(areaScores.socio_emotional_score);
  const career = evaluateCareer(areaScores.career_exploration_score);

  const academicPercentage = (areaScores.academic_score / 5) * 100;
  const emotionalPercentage = (areaScores.socio_emotional_score / 5) * 100;
  const careerPercentage = (areaScores.career_exploration_score / 5) * 100;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300"></div>
      <div className="relative bg-white w-[40%] max-h-[90%] rounded-lg shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Evaluation Area Scores
          </h2>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
            <FaBook size={32} className="text-gray-700 mb-2" />
            <span className="text-lg font-semibold text-gray-700">
              Academic Assessment
            </span>
            <MeterBar color={academic.color} width={academicPercentage} />
            <span className="mt-4 text-md font-medium text-gray-600">
              {academic.evaluation}
            </span>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Description: </span>
              {academic.description}
            </p>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Suggestion: </span>
              {academic.suggestion}
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
            <FaSmile size={32} className="text-gray-700 mb-2" />
            <span className="text-lg font-semibold text-gray-700">
              Socio-Emotional Well Being
            </span>
            <MeterBar color={emotional.color} width={emotionalPercentage} />
            <span className="mt-4 text-md font-medium text-gray-600">
              {emotional.evaluation}
            </span>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Description: </span>
              {emotional.description}
            </p>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Suggestion: </span>
              {emotional.suggestion}
            </p>
          </div>
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
            <FaBriefcase size={32} className="text-gray-700 mb-2" />
            <span className="text-lg font-semibold text-gray-700">
              Career Exploration
            </span>
            <MeterBar color={career.color} width={careerPercentage} />
            <span className="mt-4 text-md font-medium text-gray-600">
              {career.evaluation}
            </span>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Description: </span>
              {career.description}
            </p>
            <p className="mt-2 text-sm text-gray-500 text-left">
              <span className="font-semibold">Suggestion: </span>
              {career.suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScore;
