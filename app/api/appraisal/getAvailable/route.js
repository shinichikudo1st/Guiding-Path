import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get student's department from their profile
    const student = await prisma.students.findUnique({
      where: {
        student_id: sessionData.id,
      },
      select: {
        department: true,
      },
    });

    // Get available appraisals that match the student's department or are for all departments
    const availableAppraisals = await prisma.appraisalTemplate.findMany({
      where: {
        isActive: true,
        OR: [{ forDepartment: student?.department }, { forDepartment: "" }],
        NOT: {
          studentResponses: {
            some: {
              student_id: sessionData.id,
            },
          },
        },
      },
      include: {
        categories: {
          include: {
            questions: true,
          },
        },
        counselor: {
          include: {
            counselor: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(availableAppraisals);
  } catch (error) {
    console.error("Error fetching available appraisals:", error);
    return NextResponse.json(
      { error: "Failed to fetch available appraisals" },
      { status: 500 }
    );
  }
}
