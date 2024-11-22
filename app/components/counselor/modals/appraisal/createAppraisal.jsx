import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaBuilding,
  FaPlus,
  FaTrash,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import DOMPurify from "dompurify";

const CreateAppraisal = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category states
  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    questions: [],
  });
  const [categories, setCategories] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [evaluationCriteria, setEvaluationCriteria] = useState({});
  const [currentCriteria, setCurrentCriteria] = useState({
    minScore: "",
    maxScore: "",
    evaluation: "",
    description: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);

    switch (name) {
      case "title":
        setTitle(sanitizedValue);
        break;
      case "description":
        setDescription(sanitizedValue);
        break;
      case "department":
        setDepartment(sanitizedValue);
        break;
      default:
        break;
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (currentQuestion.trim()) {
      setCurrentCategory((prev) => ({
        ...prev,
        questions: [
          ...prev.questions,
          { question: currentQuestion, isActive: true },
        ],
      }));
      setCurrentQuestion("");
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (currentCategory.name && currentCategory.questions.length > 0) {
      setCategories((prev) => [...prev, currentCategory]);
      setCurrentCategory({ name: "", description: "", questions: [] });
    }
  };

  const handleAddCriteria = (e) => {
    e.preventDefault();
    if (
      selectedCategory &&
      currentCriteria.minScore &&
      currentCriteria.maxScore
    ) {
      setEvaluationCriteria((prev) => ({
        ...prev,
        [selectedCategory]: [
          ...(prev[selectedCategory] || []),
          currentCriteria,
        ],
      }));
      setCurrentCriteria({
        minScore: "",
        maxScore: "",
        evaluation: "",
        description: "",
        suggestion: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sanitizedData = {
      title: DOMPurify.sanitize(title),
      description: DOMPurify.sanitize(description),
      department: DOMPurify.sanitize(department),
      categories: categories.map((category) => ({
        name: category.name,
        description: category.description,
        questions: category.questions,
      })),
      evaluationCriteria: evaluationCriteria,
    };

    console.log(sanitizedData);

    try {
      const response = await fetch("/api/appraisal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error("Failed to create appraisal");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setDepartment("");
      setCategories([]);
      setEvaluationCriteria({});
      setStep(1);
    } catch (error) {
      console.error("Error creating appraisal:", error);
    }

    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#0B6EC9]/10">
            <div className="space-y-6">
              {/* Title Input */}
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-[#0B6EC9] text-xl flex-shrink-0" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Title
                  </label>
                  <input
                    required
                    name="title"
                    value={title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] placeholder-[#062341]/50 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                    type="text"
                    placeholder="Enter appraisal title"
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="flex items-start gap-3">
                <MdDescription className="text-[#0B6EC9] text-xl flex-shrink-0 mt-2" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    name="description"
                    value={description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] placeholder-[#062341]/50 focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20 min-h-[120px] resize-none"
                    placeholder="Enter appraisal description"
                  />
                </div>
              </div>

              {/* Department Selection */}
              <div className="flex items-center gap-3">
                <FaBuilding className="text-[#0B6EC9] text-xl flex-shrink-0" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10 text-[#062341] focus:outline-none focus:ring-2 focus:ring-[#0B6EC9]/20"
                  >
                    <option value="">All Departments</option>
                    <option value="College of Education">
                      College of Education
                    </option>
                    <option value="College of Technology">
                      College of Technology
                    </option>
                    <option value="College of Engineering">
                      College of Engineering
                    </option>
                    <option value="College of Arts and Sciences">
                      College of Arts and Sciences
                    </option>
                    <option value="College of Management">
                      College of Management and Entrepreneurship
                    </option>
                    <option value="College of CCICT">
                      College of Computer Information and Communications
                      Technology
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#0B6EC9]/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <FaClipboardList className="text-[#0B6EC9] text-xl flex-shrink-0" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Category Name
                  </label>
                  <input
                    value={currentCategory.name}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                    placeholder="Enter category name"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdDescription className="text-[#0B6EC9] text-xl flex-shrink-0 mt-2" />
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Category Description
                  </label>
                  <textarea
                    value={currentCategory.description}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                    placeholder="Enter category description"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a question"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="p-2 bg-[#0B6EC9] text-white rounded-lg"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentCategory.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
                  >
                    <span>{q.question}</span>
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        const newQuestions = currentCategory.questions.filter(
                          (_, i) => i !== idx
                        );
                        setCurrentCategory({
                          ...currentCategory,
                          questions: newQuestions,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddCategory}
                className="w-full p-3 bg-[#0B6EC9] text-white rounded-lg"
              >
                Add Category
              </button>

              {/* Categories Preview */}
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="font-semibold">{cat.name}</h3>
                    <p className="text-sm text-gray-600">{cat.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {cat.questions.length} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#0B6EC9]/10">
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="flex items-center gap-3">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Score Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Min Score
                  </label>
                  <input
                    type="number"
                    value={currentCriteria.minScore}
                    onChange={(e) =>
                      setCurrentCriteria({
                        ...currentCriteria,
                        minScore: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                    placeholder="1.0"
                    step="0.01"
                    min="1"
                    max="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#062341] mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={currentCriteria.maxScore}
                    onChange={(e) =>
                      setCurrentCriteria({
                        ...currentCriteria,
                        maxScore: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                    placeholder="2.0"
                    step="0.01"
                    min="1"
                    max="5"
                  />
                </div>
              </div>

              {/* Evaluation Label */}
              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Evaluation Label
                </label>
                <input
                  type="text"
                  value={currentCriteria.evaluation}
                  onChange={(e) =>
                    setCurrentCriteria({
                      ...currentCriteria,
                      evaluation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                  placeholder="Poor, Good, Excellent, etc."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Description
                </label>
                <textarea
                  value={currentCriteria.description}
                  onChange={(e) =>
                    setCurrentCriteria({
                      ...currentCriteria,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                  placeholder="Description of this evaluation level"
                  rows={3}
                />
              </div>

              {/* Suggestion */}
              <div>
                <label className="block text-sm font-medium text-[#062341] mb-1">
                  Suggestion
                </label>
                <textarea
                  value={currentCriteria.suggestion}
                  onChange={(e) =>
                    setCurrentCriteria({
                      ...currentCriteria,
                      suggestion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#0B6EC9]/10"
                  placeholder="Suggestions for improvement"
                  rows={3}
                />
              </div>

              <button
                type="button"
                onClick={handleAddCriteria}
                className="w-full p-3 bg-[#0B6EC9] text-white rounded-lg"
              >
                Add Evaluation Criteria
              </button>

              {/* Evaluation Criteria Preview */}
              <div className="space-y-4">
                {Object.entries(evaluationCriteria).map(
                  ([category, criteria]) => (
                    <div
                      key={category}
                      className="bg-white p-4 rounded-lg shadow"
                    >
                      <h3 className="font-semibold text-lg mb-2">{category}</h3>
                      <div className="space-y-2">
                        {criteria.map((crit, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {crit.evaluation}
                              </span>
                              <span className="text-sm text-gray-600">
                                {crit.minScore} - {crit.maxScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {crit.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return title.trim() !== "" && description.trim() !== "";
      case 2:
        return categories.length > 0;
      case 3:
        return Object.keys(evaluationCriteria).length > 0;
      default:
        return false;
    }
  };

  const handleStepChange = (newStep) => {
    if (newStep < step || validateStep(step)) {
      setStep(newStep);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col bg-white/50 rounded-xl shadow-md border border-[#0B6EC9]/10 overflow-hidden">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col p-6">
        <div className="flex-grow space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <motion.button
                type="button"
                onClick={() => handleStepChange(step - 1)}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 rounded-xl"
              >
                <FaChevronLeft /> Previous
              </motion.button>
            )}

            {step < 3 ? (
              <motion.button
                type="button"
                onClick={() => handleStepChange(step + 1)}
                disabled={!validateStep(step)}
                className={`flex items-center gap-2 px-6 py-2 ${
                  validateStep(step)
                    ? "bg-[#0B6EC9] text-white"
                    : "bg-gray-300 text-gray-500"
                } rounded-xl ml-auto`}
              >
                Next <FaChevronRight />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting || !validateStep(step)}
                className={`flex items-center gap-2 px-6 py-2 ${
                  validateStep(step) && !isSubmitting
                    ? "bg-[#0B6EC9] text-white"
                    : "bg-gray-300 text-gray-500"
                } rounded-xl ml-auto`}
              >
                {isSubmitting ? "Creating..." : "Create Appraisal"}
              </motion.button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateAppraisal;
