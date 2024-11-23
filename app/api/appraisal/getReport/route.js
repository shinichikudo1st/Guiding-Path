import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
  format,
} from "date-fns";

export async function GET(req) {
  try {
    const { sessionData } = await getSession();
    if (!sessionData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const timeFilter = url.searchParams.get("timeFilter") || "week";
    const customDate = url.searchParams.get("date");

    let startDate, endDate;
    const now = new Date();

    switch (timeFilter) {
      case "week":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "custom":
        if (customDate) {
          const date = parseISO(customDate + "-01");
          startDate = startOfMonth(date);
          endDate = endOfMonth(date);
        }
        break;
      default:
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
    }

    const appraisalData = await prisma.studentAppraisal.findMany({
      where: {
        submittedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        categoryResponses: true,
      },
    });

    // Calculate metrics
    const totalAppraisals = appraisalData.length;
    const totalStudents = new Set(appraisalData.map((a) => a.student_id)).size;

    const allScores = appraisalData.flatMap((a) =>
      a.categoryResponses.map((cr) => cr.score)
    );
    const averageScore =
      allScores.length > 0
        ? allScores.reduce((a, b) => a + b, 0) / allScores.length
        : 0;

    // Group appraisals by date
    const appraisalsByDate = appraisalData.reduce((acc, appraisal) => {
      const date = format(appraisal.submittedAt, "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const appraisalTrends = Object.entries(appraisalsByDate).map(
      ([date, count]) => ({
        date: format(parseISO(date), timeFilter === "week" ? "EEE" : "MMM dd"),
        count,
      })
    );

    const appraisalDistribution = await prisma.appraisalTemplate.findMany({
      where: {
        studentResponses: {
          some: {
            submittedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        studentResponses: {
          where: {
            submittedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            categoryResponses: {
              select: {
                score: true,
              },
            },
          },
        },
      },
    });

    const processedDistribution = appraisalDistribution.map((template) => {
      const responseCount = template.studentResponses.length;
      const allScores = template.studentResponses.flatMap((sa) =>
        sa.categoryResponses.map((cr) => cr.score)
      );
      const averageScore =
        allScores.length > 0
          ? allScores.reduce((a, b) => a + b, 0) / allScores.length
          : 0;

      return {
        title: template.title,
        responseCount,
        averageScore,
        createdAt: template.createdAt,
      };
    });

    return NextResponse.json({
      totalAppraisals,
      totalStudents,
      averageScore,
      appraisalDistribution: processedDistribution,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { message: "Error generating report" },
      { status: 500 }
    );
  }
}
