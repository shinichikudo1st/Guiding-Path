import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { sessionData } = await getSession();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "4");
  const skip = (page - 1) * limit;

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [appraisals, total] = await Promise.all([
      prisma.appraisalTemplate.findMany({
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
              category_id: null,
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
                  category: true,
                  questionResponses: {
                    include: {
                      question: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.appraisalTemplate.count({
        where: {
          counselor_id: sessionData.id,
        },
      }),
    ]);

    return NextResponse.json({
      appraisals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
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
    // First, delete all related QuestionResponses
    await prisma.questionResponse.deleteMany({
      where: {
        categoryResponse: {
          appraisal: {
            template_id: id,
          },
        },
      },
    });

    // Delete CategoryResponses
    await prisma.categoryResponse.deleteMany({
      where: {
        appraisal: {
          template_id: id,
        },
      },
    });

    // Delete StudentAppraisals
    await prisma.studentAppraisal.deleteMany({
      where: {
        template_id: id,
      },
    });

    // Delete CategoryQuestions
    await prisma.categoryQuestion.deleteMany({
      where: {
        category: {
          template_id: id,
        },
      },
    });

    // Delete EvaluationCriteria
    await prisma.evaluationCriteria.deleteMany({
      where: {
        template_id: id,
      },
    });

    // Delete AppraisalCategories
    await prisma.appraisalCategory.deleteMany({
      where: {
        template_id: id,
      },
    });

    // Finally, delete the AppraisalTemplate
    await prisma.appraisalTemplate.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Appraisal template and all related data deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appraisal template:", error);
    return NextResponse.json(
      { error: "Failed to delete appraisal template and related data" },
      { status: 500 }
    );
  }
}
