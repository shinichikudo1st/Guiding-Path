import {
  evaluateSocioEmotional,
  evaluateAcademic,
  evaluateCareer,
} from "@/app/utils/evaluate";
import CloseButton from "../../UI/closeButton";
import MeterBar from "../../UI/meterBar";

const ViewScore = ({ areaScores, close }) => {
  const academic = evaluateAcademic(areaScores.academic_score);
  const emotional = evaluateSocioEmotional(areaScores.socio_emotional_score);
  const career = evaluateCareer(areaScores.career_exploration_score);

  const academicPercentage = (areaScores.academic_score / 5) * 100;
  const emotionalPercentage = (areaScores.socio_emotional_score / 5) * 100;
  const careerPercentage = (areaScores.career_exploration_score / 5) * 100;

  return (
    <div className="absolute w-screen h-screen flex justify-center items-center z-10">
      <div className="absolute w-[100%] h-[100%] bg-black opacity-75 z-20"></div>
      <div className="grid grid-cols-3 bg-[#dfecf6] w-[80%] h-[90%] opacity-100 z-30 rounded-[20px]">
        <div className="flex col-span-3 items-center pl-[10%] text-[20pt] font-bold">
          Evaluation Area Scores
          <CloseButton buttonAction={close} />
        </div>
        <div className="flex flex-col border-y-[2px] border-[#062341] gap-[5%] row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">Academic Assessment</span>
          <MeterBar color={academic.color} width={academicPercentage} />
          <span className="mt-[10%] font-semibold text-[15pt]">
            {academic.evaluation}
          </span>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Description: </span>
            {academic.description}
          </p>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Suggestion: </span>
            {academic.suggestion}
          </p>
        </div>
        <div className="flex flex-col border-[2px] border-[#062341] gap-[5%] row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">
            Socio-Emotional Well Being
          </span>
          <MeterBar color={emotional.color} width={emotionalPercentage} />
          <span className="mt-[10%] font-semibold text-[15pt]">
            {emotional.evaluation}
          </span>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Description: </span>
            {emotional.description}
          </p>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Suggestion: </span>
            {emotional.suggestion}
          </p>
        </div>
        <div className="flex flex-col border-y-[2px] border-[#062341] gap-[5%] row-span-4 items-center pt-[10%]">
          <span className="text-[15pt] font-bold">Career Exploration</span>
          <MeterBar color={career.color} width={careerPercentage} />
          <span className="mt-[10%] font-semibold text-[15pt]">
            {career.evaluation}
          </span>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Description: </span>
            {career.description}
          </p>
          <p className=" mx-[10%] text-justify">
            <span className="font-bold">Suggestion: </span>
            {career.suggestion}
          </p>
        </div>
        <div className="flex col-span-3"></div>
      </div>
    </div>
  );
};

export default ViewScore;
