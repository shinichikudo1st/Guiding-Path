import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getOverallEvaluation(score) {
  if (score >= 4.5) {
    return {
      evaluation: "Excellent Performance",
      description:
        "You're performing exceptionally well in your personal journey.",
      suggestion:
        "Continue your outstanding work and consider mentoring others.",
    };
  } else if (score >= 4.0) {
    return {
      evaluation: "Very Good Performance",
      description:
        "You're showing strong personal performance with room for excellence.",
      suggestion:
        "Focus on fine-tuning your strategies to reach the next level.",
    };
  } else if (score >= 3.0) {
    return {
      evaluation: "Satisfactory Performance",
      description:
        "You're meeting academic requirements but have potential for improvement.",
      suggestion:
        "Identify specific areas for growth and create targeted study plans.",
    };
  } else if (score >= 2.0) {
    return {
      evaluation: "Needs Improvement",
      description:
        "Your academic performance requires attention and focused effort.",
      suggestion:
        "Consider seeking additional support and developing new study habits.",
    };
  } else if (score > 0) {
    return {
      evaluation: "Critical Attention Required",
      description:
        "Your academic standing needs immediate attention and intervention.",
      suggestion:
        "Schedule a consultation with academic advisors and create a recovery plan.",
    };
  } else {
    return {
      evaluation: "Not Yet Evaluated",
      description:
        "This student is not yet evaluated, he/she has to take appraisals first",
      suggestion:
        "Cannot make suggestion since he/she still has no score to evaluate",
    };
  }
}

export async function POST(request) {
  try {
    const { sessionData } = await getSession();
    const studentAppraisals = await prisma.studentAppraisal.findMany({
      where: { student_id: sessionData.id },
      include: { categoryResponses: true },
    });

    const allScores = studentAppraisals.flatMap((appraisal) =>
      appraisal.categoryResponses.map((cr) => cr.score)
    );

    const averageScore =
      allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 0;

    const baseEvaluation = getOverallEvaluation(averageScore);

    // Generate detailed content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `As a Guidance Counselor for college student, provide detailed guidance for a student with a performance score of ${averageScore.toFixed(
      2
    )} out of 5.
    
    Current Status: ${baseEvaluation.evaluation}
    Base Description: ${baseEvaluation.description}
    Base Suggestion: ${baseEvaluation.suggestion}

    Provide a response in the following JSON format:
    {
      "detailedEvaluation": "2-3 sentences explaining what this score means for their performance standing",
      "actionPlan": [
        "First immediate action step",
        "Second immediate action step",
        "Third immediate action step",
        "Fourth strategic action step",
        "Fifth long-term action step"
      ],
      "roadmap": [
        {
          "title": "Initial Progress",
          "timeline": "Next 2 weeks",
          "description": "Detailed description of immediate improvements",
          "expectedOutcome": "Expected outcome after completing this milestone"
        },
        {
          "title": "Short-term Goals",
          "timeline": "Within 1 month",
          "description": "Detailed description of short-term improvements",
          "expectedOutcome": "Expected outcome after completing this milestone"
        },
        {
          "title": "Medium-term Development",
          "timeline": "Within 2 months",
          "description": "Detailed description of medium-term progress",
          "expectedOutcome": "Expected outcome after completing this milestone"
        },
        {
          "title": "Sustained Growth",
          "timeline": "Within 5 months",
          "description": "Detailed description of sustained development",
          "expectedOutcome": "Expected outcome after completing this milestone"
        },
        {
          "title": "Long-term Excellence",
          "timeline": "Within 1 year",
          "description": "Detailed description of long-term mastery",
          "expectedOutcome": "Expected outcome after completing this milestone"
        }
      ]
    }

    Ensure the response is strictly in this JSON format with no additional text or markdown.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/```json\n|\n```/g, "");
      const aiResponse = JSON.parse(cleanedResponse);

      return NextResponse.json({
        score: averageScore,
        baseEvaluation: baseEvaluation,
        detailedEvaluation: aiResponse.detailedEvaluation,
        actionPlan: aiResponse.actionPlan,
        roadmap: aiResponse.roadmap,
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      return NextResponse.json(
        { error: "Failed to process evaluation" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
