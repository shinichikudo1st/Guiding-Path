import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (sessionData.role !== "student") {
    return NextResponse.json(
      { error: "Only applicable for students" },
      { status: 401 }
    );
  }

  try {
    const appraisals = await prisma.appraisals.findMany({
      where: {
        student_id: sessionData.id,
      },
      select: {
        aggregateScores: {
          select: {
            academic_score: true,
            socio_emotional_score: true,
            career_exploration_score: true,
            overall_average: true,
          },
        },
      },
    });

    const academic_average =
      appraisals.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.aggregateScores.academic_score,
        0
      ) / appraisals.length;
    const socio_emotional_average =
      appraisals.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.aggregateScores.socio_emotional_score,
        0
      ) / appraisals.length;
    const career_exploration_average =
      appraisals.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.aggregateScores.career_exploration_score,
        0
      ) / appraisals.length;
    const overall_average =
      appraisals.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.aggregateScores.overall_average,
        0
      ) / appraisals.length;

    await prisma.evaluation_Trends.create({
      data: {
        student_id: sessionData.id,
        date: new Date(),
        academic_average: academic_average,
        socio_emotional_average: socio_emotional_average,
        career_exploration_average: career_exploration_average,
        overall_average: overall_average,
      },
    });

    return NextResponse.json(
      { message: "Evaluation trend created" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
