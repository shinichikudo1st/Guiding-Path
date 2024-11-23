import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const completedAppraisals = await prisma.studentAppraisal.findMany({
      where: {
        student_id: sessionData.id,
      },
      include: {
        template: {
          include: {
            counselor: {
              include: {
                counselor: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            evaluationCriteria: {
              include: {
                category: true,
              },
            },
          },
        },
        categoryResponses: {
          include: {
            category: {
              include: {
                evaluationCriteria: true,
              },
            },
            questionResponses: {
              include: {
                question: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json(completedAppraisals);
  } catch (error) {
    console.error("Error fetching completed appraisals:", error);
    return NextResponse.json(
      { error: "Failed to fetch completed appraisals" },
      { status: 500 }
    );
  }
}
