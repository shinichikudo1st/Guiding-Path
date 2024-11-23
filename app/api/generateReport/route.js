import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

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
      referral: getReferralReport,
      systemUsage: getSystemUsageReport,
      resource: getResourceReport,
      eventRegistration: getEventRegistrationReport,
      userManagement: getUserManagementReport,
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
        orderBy: {
          _count: {
            teacher_id: "desc",
          },
        },
      }),
    ]);

  // Fetch teacher names separately
  const teacherIds = referralByTeacher.map((item) => item.teacher_id);
  const teachers = await prisma.teachers.findMany({
    where: {
      teacher_id: {
        in: teacherIds,
      },
    },
    select: {
      teacher_id: true,
      teacher: {
        select: {
          name: true,
        },
      },
    },
  });

  // Create a map of teacher_id to teacher name
  const teacherNameMap = Object.fromEntries(
    teachers.map((teacher) => [teacher.teacher_id, teacher.teacher.name])
  );

  // Add teacher names to referralByTeacher
  const referralByTeacherWithNames = referralByTeacher.map((item) => ({
    ...item,
    teacher_name: teacherNameMap[item.teacher_id] || "Unknown",
  }));

  return {
    name: "referral",
    referralByDate,
    referralByReason,
    referralByTeacher: referralByTeacherWithNames,
  };
}

async function getSystemUsageReport(startDate, endDate) {
  return {
    name: "systemUsage",
    // No additional data needed as the frontend will display a "Coming Soon" message
  };
}

async function getResourceReport(startDate, endDate) {
  const formattedStartDate = new Date(startDate);
  const formattedEndDate = new Date(endDate);

  const [
    totalResourceAccesses,
    popularResources,
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
    likedResources,
    newResources,
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

async function getUserManagementReport(startDate, endDate) {
  // const formattedStartDate = new Date(startDate);
  // const formattedEndDate = new Date(endDate);

  const [
    totalUsers,
    usersByRole,
    activeUsers,
    studentsByGrade,
    studentsByProgram,
    counselorsByDepartment,
    teachersByDepartment,
    // newUsers,
    // mostActiveUsers,
    // resourceUsage,
    eventParticipation,
    appointmentStats,
    referralStats,
  ] = await Promise.all([
    prisma.users.count(),
    prisma.users.groupBy({
      by: ["role"],
      _count: true,
    }),
    prisma.users.count({
      where: { status: "active" },
    }),
    prisma.students.groupBy({
      by: ["grade_level"],
      _count: true,
    }),
    prisma.students.groupBy({
      by: ["program"],
      _count: true,
    }),
    prisma.counselors.groupBy({
      by: ["department"],
      _count: true,
    }),
    prisma.teachers.groupBy({
      by: ["department"],
      _count: true,
    }),
    // prisma.users.count({
    //   where: {
    //     createdAt: {
    //       gte: formattedStartDate,
    //       lte: formattedEndDate,
    //     },
    //   },
    // }),
    // prisma.user_Resources.groupBy({
    //   by: ["user_id"],
    //   _count: true,
    //   orderBy: {
    //     _count: {
    //       user_id: "desc",
    //     },
    //   },
    //   take: 10,
    // }),
    // prisma.user_Resources.groupBy({
    //   by: ["resource_id"],
    //   _count: true,
    //   orderBy: {
    //     _count: {
    //       resource_id: "desc",
    //     },
    //   },
    //   take: 10,
    // }),
    prisma.event_Registration.groupBy({
      by: ["student_id"],
      _count: true,
    }),
    prisma.appointments.groupBy({
      by: ["counselor_id"],
      _count: true,
    }),
    prisma.referrals.groupBy({
      by: ["teacher_id"],
      _count: true,
    }),
  ]);

  return {
    name: "userManagement",
    totalUsers,
    usersByRole,
    activeUsers,
    studentsByGrade,
    studentsByProgram,
    counselorsByDepartment,
    teachersByDepartment,
    // newUsers,
    // mostActiveUsers,
    // resourceUsage,
    eventParticipation,
    appointmentStats,
    referralStats,
  };
}
