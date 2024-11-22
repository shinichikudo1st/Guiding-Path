import {
  evaluateSocioEmotional,
  evaluateAcademic,
  evaluateCareer,
} from "@/app/utils/evaluate";
import { FaTimes, FaBook, FaSmile, FaBriefcase } from "react-icons/fa";
import MeterBar from "../../../UI/meterBar";
import { motion } from "framer-motion";

const ViewScore = ({ areaScores, close }) => {
  const academic = evaluateAcademic(areaScores.academic_score);
  const emotional = evaluateSocioEmotional(areaScores.socio_emotional_score);
  const career = evaluateCareer(areaScores.career_exploration_score);

  const academicPercentage = (areaScores.academic_score / 5) * 100;
  const emotionalPercentage = (areaScores.socio_emotional_score / 5) * 100;
  const careerPercentage = (areaScores.career_exploration_score / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-gradient-to-br from-white/95 to-[#E6F0F9]/95 w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] rounded-2xl shadow-xl border border-[#0B6EC9]/10 overflow-hidden z-50"
      >
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Evaluation Results</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={close}
            className="text-white/80 hover:text-white transition-colors duration-300"
          >
            <FaTimes size={24} />
          </motion.button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)] p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#0B6EC9]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#0B6EC9]/40">
          {[
            {
              icon: FaBook,
              title: "Academic Assessment",
              score: academic,
              percentage: academicPercentage,
            },
            {
              icon: FaSmile,
              title: "Socio-Emotional Well Being",
              score: emotional,
              percentage: emotionalPercentage,
            },
            {
              icon: FaBriefcase,
              title: "Career Exploration",
              score: career,
              percentage: careerPercentage,
            },
          ].map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#0B6EC9]/10 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0B6EC9] to-[#095396] rounded-xl flex items-center justify-center shadow-md">
                    <area.icon className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#062341]">
                      {area.title}
                    </h3>
                    <p className="text-sm font-medium text-[#062341]/70">
                      {area.score.evaluation}
                    </p>
                  </div>
                </div>

                <MeterBar color={area.score.color} width={area.percentage} />

                <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#0B6EC9]/10">
                  <div>
                    <h4 className="text-sm font-semibold text-[#062341]">
                      Description
                    </h4>
                    <p className="text-sm text-[#062341]/70">
                      {area.score.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#062341]">
                      Suggestion
                    </h4>
                    <p className="text-sm text-[#062341]/70">
                      {area.score.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ViewScore;
