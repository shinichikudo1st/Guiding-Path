import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import moment from "moment-timezone";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    const [updatedAppointment] = await Promise.all([
      prisma.appointments.update({
        where: {
          appointment_id: id,
          student_id: sessionData.id,
        },
        data: {
          status: "cancelled",
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "332570",
          title: "Appointment Cancelled",
          content: `${sessionData.name} has cancelled an appointment.`,
          date: moment().tz("Asia/Manila").toDate(),
        },
      }),
    ]);

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Failed to cancel appointment" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Appointment cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while cancelling the appointment" },
      { status: 500 }
    );
  }
}
