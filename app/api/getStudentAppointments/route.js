import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();

  if (!sessionData || !sessionData.id) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const studentAppointments = await prisma.appointments.findMany({
      where: {
        student_id: sessionData.id,
      },
      select: {
        appointment_id: true,
        notes: true,
        reason: true,
        date_time: true,
        counsel_type: true,
        counselor: {
          include: {
            counselor: {
              select: {
                name: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { appointments: studentAppointments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
