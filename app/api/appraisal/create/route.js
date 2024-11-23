import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { sessionData } = await getSession();
  const { title, department, description, categories, evaluationCriteria } =
    await request.json();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create the appraisal template
    const appraisalTemplate = await prisma.appraisalTemplate.create({
      data: {
        title,
        description,
        forDepartment: department,
        counselor_id: sessionData.id,
      },
    });

    // Create categories and their questions
    const categoryPromises = categories.map(async (category) => {
      // Create category first
      const newCategory = await prisma.appraisalCategory.create({
        data: {
          template_id: appraisalTemplate.id,
          name: category.name,
          description: category.description,
        },
      });

      // Create questions for this category
      await prisma.categoryQuestion.createMany({
        data: category.questions.map((q) => ({
          category_id: newCategory.id,
          question: q.question,
          isActive: q.isActive,
        })),
      });

      // Create evaluation criteria for this category if it exists
      if (evaluationCriteria[category.name]) {
        await prisma.evaluationCriteria.createMany({
          data: evaluationCriteria[category.name].map((criteria) => ({
            template_id: appraisalTemplate.id,
            category_id: newCategory.id,
            minScore: parseFloat(criteria.minScore),
            maxScore: parseFloat(criteria.maxScore),
            evaluation: criteria.evaluation,
            description: criteria.description,
            suggestion: criteria.suggestion,
          })),
        });
      }
    });

    // Wait for all category and question creations to complete
    await Promise.all(categoryPromises);

    return NextResponse.json(
      { message: "Appraisal template created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appraisal template:", error);
    return NextResponse.json(
      { error: "Failed to create appraisal template" },
      { status: 500 }
    );
  }
}
