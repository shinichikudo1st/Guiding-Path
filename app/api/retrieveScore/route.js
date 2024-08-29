import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const appraisalID = parseInt(url.searchParams.get("id"));

  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const scores = await prisma.aggregate_Scores.findUnique({
      where: {
        appraisal_id: appraisalID,
      },
      select: {
        academic_score: true,
        socio_emotional_score: true,
        career_exploration_score: true,
      },
    });

    return NextResponse.json(
      { message: "Scores Retrieved", score: scores },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
