const academicCategories = [
  {
    min: 1.0,
    max: 1.99,
    category: "Very Poor",
    evaluation: "Very Low Academic Performance",
    description:
      "The student may be struggling significantly with understanding core concepts.",
    suggestion:
      "Intensive tutoring or remedial classes are recommended. Focus on foundational skills, and develop a structured study plan with regular check-ins for progress.",
    color: "bg-red-500",
  },
  {
    min: 2.0,
    max: 2.99,
    category: "Poor",
    evaluation: "Low Academic Performance",
    description:
      "The student is below average in understanding and retaining academic content.",
    suggestion:
      "Consider additional study resources or peer tutoring. Encouragement to improve study habits and time management could also help.",
    color: "bg-orange-500",
  },
  {
    min: 3.0,
    max: 3.99,
    category: "Average",
    evaluation: "Moderate Academic Performance",
    description:
      "The student has an adequate understanding of academic content but may lack depth in some areas.",
    suggestion:
      "Encourage further development of critical thinking skills and a deeper engagement with challenging subjects.",
    color: "bg-yellow-500",
  },
  {
    min: 4.0,
    max: 4.49,
    category: "Good",
    evaluation: "High Academic Performance",
    description:
      "The student demonstrates strong comprehension and a solid grasp of academic concepts.",
    suggestion:
      "Encourage continued academic growth through advanced courses and enrichment programs.",
    color: "bg-lime-300",
  },
  {
    min: 4.5,
    max: 5.0,
    category: "Excellent",
    evaluation: "Very High Academic Performance",
    description:
      "The student excels academically and shows mastery of all subjects.",
    suggestion:
      "Consider opportunities for advanced study, leadership in academic projects, or mentorship roles.",
    color: "bg-green-500",
  },
];

const socioEmotionalCategories = [
  {
    min: 1.0,
    max: 1.99,
    category: "Very Poor",
    evaluation: "Depressed/Highly Anxious",
    description:
      "The individual may be experiencing significant emotional distress.",
    suggestion:
      "Seek professional mental health support and encourage regular emotional check-ins. Consider building a support network and engaging in stress-reducing activities.",
    color: "bg-red-500",
  },
  {
    min: 2.0,
    max: 2.99,
    category: "Poor",
    evaluation: "Stressed/Low Emotional Well-being",
    description:
      "The individual may feel overwhelmed and emotionally unstable.",
    suggestion:
      "Encourage stress management techniques like mindfulness or therapy. Promote relaxation and self-care activities.",
    color: "bg-orange-500",
  },
  {
    min: 3.0,
    max: 3.99,
    category: "Average",
    evaluation: "Neutral/Stable",
    description:
      "The individual is emotionally stable but may have occasional stressors.",
    suggestion:
      "Continue fostering emotional resilience through healthy coping strategies. Regular self-care is advised to maintain emotional balance.",
    color: "bg-yellow-500",
  },
  {
    min: 4.0,
    max: 4.49,
    category: "Good",
    evaluation: "Emotionally Well-balanced",
    description:
      "The individual demonstrates emotional resilience and balance.",
    suggestion:
      "Encourage continued emotional growth through personal reflection and fostering supportive relationships.",
    color: "bg-lime-300",
  },
  {
    min: 4.5,
    max: 5.0,
    category: "Excellent",
    evaluation: "Highly Resilient/Emotionally Strong",
    description:
      "The individual is emotionally resilient and maintains a strong sense of well-being.",
    suggestion:
      "Consider opportunities for leadership in emotional wellness, such as mentoring others or advocating for mental health awareness.",
    color: "bg-green-500",
  },
];

const careerExplorationCategories = [
  {
    min: 1.0,
    max: 1.99,
    category: "Very Poor",
    evaluation: "Lack of Career Direction",
    description:
      "The individual may lack clarity or motivation regarding their career path.",
    suggestion:
      "Engage in career counseling or exploration activities. Start building an understanding of interests and strengths through internships or career assessments.",
    color: "bg-red-500",
  },
  {
    min: 2.0,
    max: 2.99,
    category: "Poor",
    evaluation: "Uncertain Career Goals",
    description:
      "The individual may have some ideas but lacks confidence in their career direction.",
    suggestion:
      "Encourage further exploration of different career paths through informational interviews, volunteering, or career workshops.",
    color: "bg-orange-500",
  },
  {
    min: 3.0,
    max: 3.99,
    category: "Average",
    evaluation: "Moderate Career Clarity",
    description:
      "The individual has a reasonable understanding of potential career paths but may still be exploring options.",
    suggestion:
      "Focus on honing specific career skills and gaining relevant experience in fields of interest.",
    color: "bg-yellow-500",
  },
  {
    min: 4.0,
    max: 4.49,
    category: "Good",
    evaluation: "Clear Career Path",
    description:
      "The individual has a clear direction and is actively working towards their career goals.",
    suggestion:
      "Continue building skills and experiences that align with the chosen career path. Seek mentorship for further growth.",
    color: "bg-lime-300",
  },
  {
    min: 4.5,
    max: 5.0,
    category: "Excellent",
    evaluation: "Strong Career Focus and Direction",
    description:
      "The individual has a strong sense of career purpose and is well on their way to achieving their goals.",
    suggestion:
      "Encourage taking leadership roles in career-related activities and exploring opportunities for further advancement.",
    color: "bg-green-500",
  },
];

export function evaluateAcademic(academicScore) {
  const category = academicCategories.find(
    (range) => academicScore >= range.min && academicScore <= range.max
  );

  return category;
}

export function evaluateSocioEmotional(socioEmotionalScore) {
  const category = socioEmotionalCategories.find(
    (range) =>
      socioEmotionalScore >= range.min && socioEmotionalScore <= range.max
  );

  return category;
}

export function evaluateCareer(careerScore) {
  const category = careerExplorationCategories.find(
    (range) => careerScore >= range.min && careerScore <= range.max
  );

  return category;
}
