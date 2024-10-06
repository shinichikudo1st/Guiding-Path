import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import {
  evaluateAcademic,
  evaluateSocioEmotional,
  evaluateCareer,
} from "@/app/utils/evaluate";

export async function POST(request) {
  const { selectedReports, startDate, endDate } = await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!selectedReports || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const reportFunctions = {
      appointment: getAppointmentReport,
      appraisal: getAppraisalReport,
      referral: getReferralReport,
      systemUsage: getSystemUsageReport,
      resource: getResourceReport,
      evaluationTrends: getEvaluationTrendsReport,
      eventRegistration: getEventRegistrationReport,
      userManagement: getUserManagementReport,
      resourcePopularity: getResourcePopularityReport,
    };

    const reportData = await Promise.all(
      selectedReports.map((reportType) => {
        const reportFunction = reportFunctions[reportType];
        return reportFunction ? reportFunction(startDate, endDate) : null;
      })
    );

    return NextResponse.json({ reportData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getAppointmentReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [
    appointmentByDate,
    appointmentsByReferral,
    appointmentsBySelf,
    appointmentByReason,
  ] = await Promise.all([
    prisma.appointments.count({
      where: {
        date_time: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.appointments.count({
      where: {
        type: "referral",
        date_time: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.appointments.count({
      where: {
        type: "self-appoint",
        date_time: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.appointments.groupBy({
      by: ["reason"],
      where: {
        reason: {
          in: [
            "emotional_support",
            "career_guidance",
            "encouragement",
            "stress_management",
          ],
        },
        date_time: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
      _count: {
        reason: true,
      },
    }),
  ]);

  return {
    name: "appointment",
    appointmentByDate,
    appointmentsByReferral,
    appointmentsBySelf,
    appointmentByReason,
  };
}

async function getReferralReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [referralByDate, referralByReason, referralByTeacher] =
    await Promise.all([
      prisma.referrals.count({
        where: {
          dateSubmitted: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
      }),
      prisma.referrals.groupBy({
        by: ["reason"],
        where: {
          reason: {
            in: [
              "emotional_support",
              "career_guidance",
              "encouragement",
              "stress_management",
            ],
          },
          dateSubmitted: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
        _count: {
          reason: true,
        },
      }),
      prisma.referrals.groupBy({
        by: ["teacher_id"],
        where: {
          dateSubmitted: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
        _count: {
          teacher_id: true,
        },
      }),
    ]);

  return {
    name: "referral",
    referralByDate,
    referralByReason,
    referralByTeacher,
  };
}

async function getAppraisalReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [appraisalByDate, appraisalAreaAverage] = await Promise.all([
    prisma.appraisals.count({
      where: {
        date_of_submission: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.evaluation_Areas.groupBy({
      by: ["area_name"],
      where: {
        appraisal: {
          date_of_submission: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
        area_name: {
          in: [
            "Academic Self-Assessment",
            "Socio-Emotional Well Being",
            "Career Path Exploration",
          ],
        },
      },
      _sum: { score: true },
      _count: { area_name: true },
    }),
  ]);

  const areaAverage = appraisalAreaAverage.map((area) => ({
    area_name: area.area_name,
    average_score: area._sum.score / area._count.area_name,
  }));

  return {
    name: "appraisal",
    appraisalByDate,
    appraisalAreaAverage: areaAverage,
  };
}

async function getResourceReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [
    totalResourceAccesses,
    popularResources,
    resourcesByCategory,
    likedResources,
    newResources,
  ] = await Promise.all([
    prisma.user_Resources.count({
      where: {
        access_date: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.user_Resources.groupBy({
      by: ["resource_id"],
      where: {
        access_date: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
      _count: {
        resource_id: true,
      },
      orderBy: {
        _count: {
          resource_id: "desc",
        },
      },
      take: 10,
    }),
    prisma.resources.groupBy({
      by: ["category"],
      where: {
        userResources: {
          some: {
            access_date: {
              gte: formattedStartDate,
              lte: formattedEndDate,
            },
          },
        },
      },
      _count: {
        category: true,
      },
    }),
    prisma.user_Resources.count({
      where: {
        liked: true,
        access_date: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
    prisma.resources.count({
      where: {
        createdAt: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
    }),
  ]);

  return {
    name: "resource",
    totalResourceAccesses,
    popularResources,
    resourcesByCategory,
    likedResources,
    newResources,
  };
}

async function getEvaluationTrendsReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [evaluationTrendsData, aggregateScores] = await Promise.all([
    prisma.evaluation_Trends.findMany({
      where: {
        date: {
          gte: formattedStartDate,
          lte: formattedEndDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    }),
    prisma.aggregate_Scores.findMany({
      where: {
        appraisal: {
          date_of_submission: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
      },
      include: {
        appraisal: {
          select: {
            date_of_submission: true,
          },
        },
      },
    }),
  ]);

  const processedData = evaluationTrendsData.map((trend) => ({
    date: trend.date,
    academic: {
      score: parseFloat(trend.academic_average),
      evaluation: evaluateAcademic(parseFloat(trend.academic_average)),
    },
    socioEmotional: {
      score: parseFloat(trend.socio_emotional_average),
      evaluation: evaluateSocioEmotional(
        parseFloat(trend.socio_emotional_average)
      ),
    },
    careerExploration: {
      score: parseFloat(trend.career_exploration_average),
      evaluation: evaluateCareer(parseFloat(trend.career_exploration_average)),
    },
    overallAverage: parseFloat(trend.overall_average),
  }));

  const aggregateScoresProcessed = aggregateScores.map((score) => ({
    date: score.appraisal.date_of_submission,
    academic: {
      score: score.academic_score,
      evaluation: evaluateAcademic(score.academic_score),
    },
    socioEmotional: {
      score: score.socio_emotional_score,
      evaluation: evaluateSocioEmotional(score.socio_emotional_score),
    },
    careerExploration: {
      score: score.career_exploration_score,
      evaluation: evaluateCareer(score.career_exploration_score),
    },
    overallAverage: score.overall_average,
  }));

  // Calculate overall averages
  const overallAverages = aggregateScores.reduce(
    (acc, score) => {
      acc.academic += score.academic_score;
      acc.socioEmotional += score.socio_emotional_score;
      acc.careerExploration += score.career_exploration_score;
      acc.overallAverage += score.overall_average;
      return acc;
    },
    { academic: 0, socioEmotional: 0, careerExploration: 0, overallAverage: 0 }
  );

  const count = aggregateScores.length;
  const averages = {
    academic: {
      score: overallAverages.academic / count,
      evaluation: evaluateAcademic(overallAverages.academic / count),
    },
    socioEmotional: {
      score: overallAverages.socioEmotional / count,
      evaluation: evaluateSocioEmotional(
        overallAverages.socioEmotional / count
      ),
    },
    careerExploration: {
      score: overallAverages.careerExploration / count,
      evaluation: evaluateCareer(overallAverages.careerExploration / count),
    },
    overallAverage: overallAverages.overallAverage / count,
  };

  return {
    name: "evaluationTrends",
    trends: processedData,
    aggregateScores: aggregateScoresProcessed,
    averages: averages,
  };
}

async function getEventRegistrationReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [eventCount, registrationCount, eventsByAttendance, upcomingEvents] =
    await Promise.all([
      // Total number of events in the date range
      prisma.events.count({
        where: {
          date_time: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
      }),

      // Total number of registrations in the date range
      prisma.event_Registration.count({
        where: {
          date_time: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
      }),

      // Events sorted by number of registrations (most popular events)
      prisma.events.findMany({
        where: {
          date_time: {
            gte: formattedStartDate,
            lte: formattedEndDate,
          },
        },
        select: {
          event_id: true,
          title: true,
          date_time: true,
          location: true,
          _count: {
            select: { eventRegistrations: true },
          },
        },
        orderBy: {
          eventRegistrations: {
            _count: "desc",
          },
        },
        take: 10, // Top 10 most popular events
      }),

      // Upcoming events (events after the end date)
      prisma.events.findMany({
        where: {
          date_time: {
            gt: formattedEndDate,
          },
        },
        select: {
          event_id: true,
          title: true,
          date_time: true,
          location: true,
          _count: {
            select: { eventRegistrations: true },
          },
        },
        orderBy: {
          date_time: "asc",
        },
        take: 5, // Next 5 upcoming events
      }),
    ]);

  // Process the events by attendance data
  const processedEventsByAttendance = eventsByAttendance.map((event) => ({
    event_id: event.event_id,
    title: event.title,
    date_time: event.date_time,
    location: event.location,
    registrations: event._count.eventRegistrations,
  }));

  // Process the upcoming events data
  const processedUpcomingEvents = upcomingEvents.map((event) => ({
    event_id: event.event_id,
    title: event.title,
    date_time: event.date_time,
    location: event.location,
    registrations: event._count.eventRegistrations,
  }));

  return {
    name: "eventRegistration",
    totalEvents: eventCount,
    totalRegistrations: registrationCount,
    popularEvents: processedEventsByAttendance,
    upcomingEvents: processedUpcomingEvents,
  };
}

async function getUserManagementReport(startDate, endDate) {}

async function getResourcePopularityReport(startDate, endDate) {}

async function getSystemUsageReport(startDate, endDate) {}
