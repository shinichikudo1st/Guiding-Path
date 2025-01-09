import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import moment from "moment-timezone";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { sessionData } = await getSession();
    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get first and last day of current month
    const now = moment().tz("Asia/Manila");
    const startDate = now.startOf("month").toDate();
    const endDate = now.endOf("month").toDate();

    const [
      appointmentData,
      referralData,
      appraisalData,
      requestData,
      resourceData,
      eventData,
    ] = await Promise.all([
      getAppointmentData(startDate, endDate),
      getReferralData(startDate, endDate),
      getAppraisalData(startDate, endDate),
      getRequestData(startDate, endDate),
      getResourceData(startDate, endDate),
      getEventData(startDate, endDate),
    ]);

    return NextResponse.json([
      appointmentData,
      referralData,
      appraisalData,
      requestData,
      resourceData,
      eventData,
    ]);
  } catch (error) {
    console.error("Dashboard Report Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getAppointmentData(startDate, endDate) {
  const [
    appointmentByDate,
    appointmentsBySelf,
    appointmentByReason,
    appointmentsByStatus,
  ] = await Promise.all([
    prisma.appointments.count({
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.appointments.count({
      where: {
        type: "self-appoint",
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.appointments.groupBy({
      by: ["reason"],
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        reason: true,
      },
    }),
    prisma.appointments.groupBy({
      by: ["status"],
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    }),
  ]);

  return {
    name: "appointment",
    appointmentByDate,
    appointmentsBySelf,
    appointmentByReason,
    appointmentsByStatus,
  };
}

async function getReferralData(startDate, endDate) {
  const [referralByDate, referralByReason, referralByStatus, topReferrers] =
    await Promise.all([
      prisma.referrals.count({
        where: {
          dateSubmitted: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.referrals.groupBy({
        by: ["reason"],
        where: {
          dateSubmitted: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: {
          reason: true,
        },
      }),
      prisma.referrals.groupBy({
        by: ["status"],
        where: {
          dateSubmitted: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      }),
      prisma.referrals.groupBy({
        by: ["teacher_id"],
        where: {
          dateSubmitted: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
        take: 5,
        orderBy: {
          _count: {
            teacher_id: "desc",
          },
        },
      }),
    ]);

  return {
    name: "referral",
    referralByDate,
    referralByReason,
    referralByStatus,
    topReferrers,
  };
}

async function getAppraisalData(startDate, endDate) {
  const [totalAppraisals, categoryResponses, totalStudents] = await Promise.all([
    prisma.studentAppraisal.count({
      where: {
        submittedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.categoryResponse.findMany({
      where: {
        appraisal: {
          submittedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      select: {
        score: true,
      },
    }),
    prisma.students.count()
  ]);

  const scores = categoryResponses.map(cr => cr.score);
  const averageScores = {
    _avg: {
      score: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    },
    _min: {
      score: scores.length > 0 ? Math.min(...scores) : null,
    },
    _max: {
      score: scores.length > 0 ? Math.max(...scores) : null,
    },
  };

  return {
    name: "appraisal",
    totalAppraisals,
    averageScores,
    totalStudents
  };
}

async function getRequestData(startDate, endDate) {
  const [totalRequests, requestsByUrgency, pendingRequests] = await Promise.all(
    [
      prisma.appointment_Requests.count({
        where: {
          request_date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.appointment_Requests.groupBy({
        by: ["urgency"],
        where: {
          request_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      }),
      prisma.appointment_Requests.count({
        where: {
          request_date: {
            gte: startDate,
            lte: endDate,
          },
          // Add condition for pending status if you have one
        },
      }),
    ]
  );

  return {
    name: "request",
    totalRequests,
    requestsByUrgency,
    pendingRequests,
  };
}

async function getResourceData(startDate, endDate) {
  const [totalResources, resourceAccesses, popularResources] =
    await Promise.all([
      prisma.resources.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.user_Resources.count({
        where: {
          access_date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.user_Resources.groupBy({
        by: ["resource_id"],
        where: {
          access_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
        orderBy: {
          _count: {
            resource_id: "desc",
          },
        },
        take: 5,
      }),
    ]);

  return {
    name: "resource",
    totalResources,
    resourceAccesses,
    popularResources,
  };
}

async function getEventData(startDate, endDate) {
  const [totalEvents, eventRegistrations, upcomingEvents] = await Promise.all([
    prisma.events.count({
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.event_Registration.count({
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.events.findMany({
      where: {
        date_time: {
          gte: new Date(),
        },
      },
      orderBy: {
        date_time: "asc",
      },
      take: 5,
    }),
  ]);

  return {
    name: "event",
    totalEvents,
    eventRegistrations,
    upcomingEvents,
  };
}
