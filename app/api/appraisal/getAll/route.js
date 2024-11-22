import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appraisals = await prisma.appraisalTemplate.findMany({
      where: {
        counselor_id: sessionData.id,
      },
      include: {
        categories: {
          include: {
            questions: true,
            evaluationCriteria: true,
          },
        },
        evaluationCriteria: {
          where: {
            category_id: null, // Get overall criteria only
          },
        },
        studentResponses: {
          include: {
            student: {
              include: {
                student: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            categoryResponses: {
              include: {
                questionResponses: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(appraisals);
  } catch (error) {
    console.error("Error fetching appraisals:", error);
    return NextResponse.json(
      { error: "Failed to fetch appraisals" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { sessionData } = await getSession();
  const { id, title, department, description, categories, evaluationCriteria } =
    await request.json();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Update the main template
    const updatedTemplate = await prisma.appraisalTemplate.update({
      where: { id },
      data: {
        title,
        description,
        forDepartment: department,
      },
    });

    // Delete existing categories and their related data
    await prisma.appraisalCategory.deleteMany({
      where: { template_id: id },
    });

    // Create new categories and their questions
    const categoryPromises = categories.map(async (category) => {
      const newCategory = await prisma.appraisalCategory.create({
        data: {
          template_id: id,
          name: category.name,
          description: category.description,
        },
      });

      await prisma.categoryQuestion.createMany({
        data: category.questions.map((q) => ({
          category_id: newCategory.id,
          question: q.question,
          isActive: q.isActive,
        })),
      });

      if (evaluationCriteria[category.name]) {
        await prisma.evaluationCriteria.createMany({
          data: evaluationCriteria[category.name].map((criteria) => ({
            template_id: id,
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

    await Promise.all(categoryPromises);

    return NextResponse.json(
      { message: "Appraisal template updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appraisal template:", error);
    return NextResponse.json(
      { error: "Failed to update appraisal template" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { sessionData } = await getSession();
  const { id } = await request.json();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.appraisalTemplate.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Appraisal template deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appraisal template:", error);
    return NextResponse.json(
      { error: "Failed to delete appraisal template" },
      { status: 500 }
    );
  }
}
