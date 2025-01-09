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

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { sessionData } = await getSession();
    if (!sessionData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const timeFilter = url.searchParams.get("timeFilter") || "week";
    const customStartDate = url.searchParams.get("startDate");
    const customEndDate = url.searchParams.get("endDate");

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
        if (customStartDate && customEndDate) {
          const startDateObj = parseISO(customStartDate + "-01");
          const endDateObj = parseISO(customEndDate + "-01");
          startDate = startOfMonth(startDateObj);
          endDate = endOfMonth(endDateObj);
        } else {
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
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

    // Add to the existing GET function after calculating basic metrics
    const trendAnalysis = {
      previousPeriodAverage: 0,
      currentPeriodAverage: averageScore,
      trend: "stable",
      percentageChange: 0,
    };

    // Calculate previous period metrics
    const previousStartDate =
      timeFilter === "week"
        ? new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);

    const previousPeriodData = await prisma.studentAppraisal.findMany({
      where: {
        submittedAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
      include: {
        categoryResponses: true,
      },
    });

    if (previousPeriodData.length > 0) {
      const previousScores = previousPeriodData.flatMap((a) =>
        a.categoryResponses.map((cr) => cr.score)
      );
      trendAnalysis.previousPeriodAverage =
        previousScores.reduce((a, b) => a + b, 0) / previousScores.length;
      trendAnalysis.percentageChange =
        ((averageScore - trendAnalysis.previousPeriodAverage) /
          trendAnalysis.previousPeriodAverage) *
        100;
      trendAnalysis.trend =
        trendAnalysis.percentageChange > 0
          ? "improving"
          : trendAnalysis.percentageChange < 0
          ? "declining"
          : "stable";
    }

    // Calculate participation metrics
    const totalStudentsInSystem = await prisma.students.count();
    const participationMetrics = {
      totalEligible: totalStudentsInSystem,
      participated: totalStudents,
      participationRate: (totalStudents / totalStudentsInSystem) * 100,
    };

    // Identify critical cases
    const criticalCases = await prisma.studentAppraisal.findMany({
      where: {
        submittedAt: {
          gte: startDate,
          lte: endDate,
        },
        categoryResponses: {
          some: {
            score: {
              lt: 3.0,
            },
          },
        },
      },
      include: {
        student: {
          include: {
            student: true,
          },
        },
        categoryResponses: true,
      },
    });

    const criticalMetrics = {
      totalCritical: criticalCases.length,
      criticalRate: (criticalCases.length / totalAppraisals) * 100,
      criticalStudents: criticalCases
        .map((c) => ({
          name: c.student.student.name,
          averageScore:
            c.categoryResponses.reduce((acc, cr) => acc + cr.score, 0) /
            c.categoryResponses.length,
        }))
        .slice(0, 5), // Top 5 most critical cases
    };

    // Add to the response
    return NextResponse.json({
      totalAppraisals,
      totalStudents,
      averageScore,
      trendAnalysis,
      participationMetrics,
      criticalMetrics,
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
