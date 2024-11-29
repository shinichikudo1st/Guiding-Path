import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

export async function GET() {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  try {
    // First, get all expired appointments
    const expiredAppointments = await prisma.appointments.findMany({
      where: {
        status: "pending",
        date_time: {
          lte: oneMinuteAgo,
        },
      },
      select: {
        appointment_id: true,
      },
    });

    const appointmentIds = expiredAppointments.map((app) => app.appointment_id);

    // Use transaction to update both appointments and referrals
    const result = await prisma.$transaction([
      // Update appointments
      prisma.appointments.updateMany({
        where: {
          appointment_id: {
            in: appointmentIds,
          },
        },
        data: {
          status: "closed",
        },
      }),

      // Update associated referrals
      prisma.referrals.updateMany({
        where: {
          appointment_id: {
            in: appointmentIds,
          },
          status: {
            not: "closed",
          },
        },
        data: {
          status: "closed",
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Appointments and referrals updated successfully",
        updatedAppointments: result[0].count,
        updatedReferrals: result[1].count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointments and referrals:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
