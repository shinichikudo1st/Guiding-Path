import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 *
 *
 * @function createAppraisal creating new appraisal record and new appraisal area record
 *
 * @param {Request} request request object with a JSON body containing raw scores of
 * academic, socioEmotional, and career appraisal
 *
 * @param {Object} request.body                 JSON body of the request
 * @param {number} request.body.academic        academic score 1-100 eg: 87
 * @param {number} request.body.socioEmotional  socioEmotional score 1-100 eg: 98
 * @param {number} request.body.career          career score 1-100 eg: 80
 *
 *
 * @returns {NextResponse}
 */

export async function POST(request) {
  const { academic, socioEmotional, career } = await request.json();

  const aggregateAcademic = academic / 20;
  const aggregateSocio = socioEmotional / 20;
  const aggregateCareer = career / 20;
  const overall_score = (academic / 20 + socioEmotional / 20 + career / 20) / 3;

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const currentDate = String(formattedDate);
  const currentYear = String(date.getFullYear());

  try {
    const appraisal = await prisma.appraisals.create({
      data: {
        student_id: sessionData.id,
        date: currentYear,
        date_of_submission: currentDate,
      },
    });

    const areas = [
      { name: "Academic Self-Assessment", score: academic },
      { name: "Socio-Emotional Well Being", score: socioEmotional },
      { name: "Career Path Exploration", score: career },
    ];

    for (const area of areas) {
      await prisma.evaluation_Areas.create({
        data: {
          appraisal_id: appraisal.appraisal_id,
          area_name: area.name,
          score: area.score,
        },
      });
    }

    await prisma.aggregate_Scores.create({
      data: {
        appraisal_id: appraisal.appraisal_id,
        academic_score: aggregateAcademic,
        socio_emotional_score: aggregateSocio,
        career_exploration_score: aggregateCareer,
        overall_average: overall_score,
      },
    });

    return NextResponse.json(
      { message: "Appraisal Submitted" },
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
