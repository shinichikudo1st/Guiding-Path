import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const appraisals = await prisma.appraisals.findMany({
      where: {
        user_id: sessionData.id,
      },
      select: {
        appraisal_id: true,
        date_of_submission: true,
        aggregateScores: true,
      },
    });

    const formattedAppraisals = appraisals.map((appraisal) => ({
      id: appraisal.appraisal_id,
      date: appraisal.date_of_submission,
      aggregateScores: appraisal.aggregateScores,
    }));

    return NextResponse.json(
      { message: "Retrieved Appraisals", appraisal: formattedAppraisals },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving appraisals:", error);
    return NextResponse.json(
      { message: "Error retrieving appraisals" },
      { status: 500 }
    );
  }
}
