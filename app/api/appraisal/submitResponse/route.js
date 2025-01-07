import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId, responses } = await request.json();

    // Create the student appraisal record
    const appraisal = await prisma.studentAppraisal.create({
      data: {
        template_id: templateId,
        student_id: sessionData.id,
        submittedAt: moment().tz("Asia/Manila").toDate(),
      },
    });

    // Group responses by category using Promise.all
    const questions = await Promise.all(
      responses.map(({ questionId }) =>
        prisma.categoryQuestion.findUnique({
          where: { id: questionId },
          select: { category_id: true },
        })
      )
    );

    const responsesByCategory = responses.reduce(
      (acc, { questionId, response }, index) => {
        const categoryId = questions[index].category_id;
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push({ questionId, response });
        return acc;
      },
      {}
    );

    // Create category responses and question responses
    await Promise.all(
      Object.entries(responsesByCategory).map(
        async ([categoryId, categoryResponses]) => {
          // Create category response first
          const categoryResponse = await prisma.categoryResponse.create({
            data: {
              appraisal_id: appraisal.id,
              category_id: parseInt(categoryId),
              score:
                categoryResponses.reduce((sum, r) => sum + r.response, 0) /
                categoryResponses.length,
            },
          });

          // Then create all question responses for this category
          await prisma.questionResponse.createMany({
            data: categoryResponses.map(({ questionId, response }) => ({
              category_response_id: categoryResponse.id,
              question_id: questionId,
              response,
            })),
          });
        }
      )
    );

    return NextResponse.json(
      { message: "Appraisal submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting appraisal:", error);
    return NextResponse.json(
      { error: "Failed to submit appraisal" },
      { status: 500 }
    );
  }
}
