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
    appointmentByDate,
    appointmentsByReferral,
    appointmentsBySelf,
    appointmentByReason,
  };
}

async function getAppraisalReport(startDate, endDate) {}

async function getReferralReport(startDate, endDate) {}

async function getSystemUsageReport(startDate, endDate) {}

async function getResourceReport(startDate, endDate) {}

async function getEvaluationTrendsReport(startDate, endDate) {}

async function getEventRegistrationReport(startDate, endDate) {}

async function getUserManagementReport(startDate, endDate) {}

async function getResourcePopularityReport(startDate, endDate) {}
