import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaTimes,
  FaSpinner,
  FaChartBar,
  FaLightbulb,
  FaRoad,
  FaClock,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";

const ChatbotModal = ({ onClose }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("evaluation");

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
          setEvaluation(data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch evaluation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluation();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 4.0) return "bg-lime-300";
    if (score >= 3.0) return "bg-yellow-500";
    if (score >= 2.0) return "bg-orange-500";
    return "bg-red-500";
  };

  const tabs = [
    { id: "evaluation", label: "Evaluation", icon: FaChartBar },
    { id: "personality", label: "Personality", icon: FaUser },
    { id: "action", label: "Action Plan", icon: FaLightbulb },
    { id: "roadmap", label: "Development Path", icon: FaRoad },
  ];

  const EvaluationTab = ({ evaluation, getScoreColor }) => {
    const scoreRanges = [
      { min: 4.5, max: 5.0, label: "Excellent", color: "bg-green-500" },
      { min: 4.0, max: 4.49, label: "Very Good", color: "bg-lime-300" },
      { min: 3.0, max: 3.99, label: "Satisfactory", color: "bg-yellow-500" },
      { min: 2.0, max: 2.99, label: "Needs Improvement", color: "bg-orange-500" },
      { min: 0.1, max: 1.99, label: "Critical", color: "bg-red-300" },
      { min: 0.0, max: 0.0, label: "No Score", color: "bg-gray-300" },
    ];

    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
                  <FaChartBar className="text-[#0B6EC9] text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-[#062341]">
                  Performance Overview
                </h3>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-lg font-bold text-white ${getScoreColor(
                  evaluation?.score
                )}`}
              >
                {evaluation?.score.toFixed(2)}
              </span>
            </div>

            <div className="px-4">
              <div className="bg-gradient-to-br from-[#0B6EC9]/5 to-transparent p-4 rounded-lg">
                <h4 className="font-semibold text-[#062341] mb-2">
                  {evaluation?.baseEvaluation.evaluation}
                </h4>
                <p className="text-gray-600">{evaluation?.detailedEvaluation}</p>
              </div>
            </div>

            {/* Score Legend */}
            <div className="px-4 pb-4">
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-[#062341] mb-2 flex items-center gap-2 px-1">
                  <FaChartBar className="text-[#0B6EC9] text-xs" />
                  <span>Score Range Guide</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scoreRanges.map((range) => (
                    <div
                      key={range.label}
                      className="bg-white flex items-center gap-2 px-3 py-1.5 rounded border border-gray-100"
                    >
                      <div className={`w-2 h-2 rounded-full ${range.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {range.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({range.min.toFixed(1)}-{range.max.toFixed(1)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ActionPlanTab = ({ evaluation }) => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
              <FaLightbulb className="text-[#0B6EC9] text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#062341]">
              Recommended Actions
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {evaluation?.actionPlan.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-[#0B6EC9]/5 rounded-lg"
            >
              <FaCheckCircle className="text-[#0B6EC9] mt-1" />
              <div>
                <p className="text-gray-600">{action}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const RoadmapTab = ({ evaluation }) => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
              <FaRoad className="text-[#0B6EC9] text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#062341]">
              Development Roadmap
            </h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {evaluation?.roadmap.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 pb-8 last:pb-0"
            >
              <div className="absolute left-3 top-0 bottom-0 w-px bg-[#0B6EC9]/20" />
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#0B6EC9]" />
              </div>
              <div className="bg-[#0B6EC9]/5 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FaClock className="text-[#0B6EC9]" />
                  <span className="text-sm font-medium text-[#0B6EC9]">
                    {milestone.timeline}
                  </span>
                </div>
                <h4 className="font-semibold text-[#062341] mb-2">
                  {milestone.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {milestone.description}
                </p>
                <div className="bg-white/50 p-2 rounded border border-[#0B6EC9]/10">
                  <p className="text-sm text-[#0B6EC9]">
                    Expected Outcome: {milestone.expectedOutcome}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const PersonalityTab = ({ evaluation }) => {
    const traits = [
      {
        name: "Openness",
        key: "openness",
        description: "Curiosity and willingness to try new experiences",
      },
      {
        name: "Conscientiousness",
        key: "conscientiousness",
        description: "Organization and responsibility level",
      },
      {
        name: "Extraversion",
        key: "extraversion",
        description: "Social interaction and energy from others",
      },
      {
        name: "Agreeableness",
        key: "agreeableness",
        description: "Cooperation and consideration of others",
      },
      {
        name: "Neuroticism",
        key: "neuroticism",
        description: "Emotional stability and stress response",
      },
    ];

    const getTraitColor = (score) => {
      if (score >= 4.5) return "bg-green-500";
      if (score >= 4.0) return "bg-lime-300";
      if (score >= 3.0) return "bg-yellow-500";
      if (score >= 2.0) return "bg-orange-500";
      return "bg-red-500";
    };

    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0B6EC9]/10 flex items-center justify-center">
                <FaUser className="text-[#0B6EC9] text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-[#062341]">
                OCEAN Personality Analysis
              </h3>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {traits.map((trait) => (
              <div
                key={trait.key}
                className="bg-gray-50 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-[#062341]">{trait.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getTraitColor(
                      evaluation?.personalityAnalysis?.[trait.key]?.score || 0
                    )}`}
                  >
                    {evaluation?.personalityAnalysis?.[trait.key]?.score ? 
                      evaluation.personalityAnalysis[trait.key].score.toFixed(1) 
                      : "N/A"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{trait.description}</p>
                <p className="text-sm text-gray-700">
                  {evaluation?.personalityAnalysis?.[trait.key]?.description || "No analysis available"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-6 md:p-8 z-[999999]"
      onClick={() => onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-[90%] md:max-w-[85%] lg:max-w-[75%] xl:max-w-[65%] 2xl:max-w-2xl h-[90vh] md:h-[85vh] lg:h-[80vh] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div className="bg-gradient-to-r from-[#0B6EC9] to-[#095396] p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 text-white">
              <FaRobot className="text-2xl" />
              <h3 className="font-semibold">Student Performance Analysis</h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#0B6EC9]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-[calc(90vh-120px)] md:h-[calc(85vh-120px)] lg:h-[calc(80vh-120px)] flex items-center justify-center">
            <FaSpinner className="animate-spin text-[#0B6EC9] text-2xl" />
          </div>
        ) : (
          <div className="h-[calc(90vh-120px)] md:h-[calc(85vh-120px)] lg:h-[calc(80vh-120px)] overflow-y-auto">
            {/* Content based on active tab */}
            {activeTab === "evaluation" && (
              <EvaluationTab
                evaluation={evaluation}
                getScoreColor={getScoreColor}
              />
            )}
            {activeTab === "personality" && (
              <PersonalityTab evaluation={evaluation} />
            )}
            {activeTab === "action" && (
              <ActionPlanTab evaluation={evaluation} />
            )}
            {activeTab === "roadmap" && (
              <RoadmapTab evaluation={evaluation} />
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ChatbotModal;
