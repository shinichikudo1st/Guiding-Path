import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const dateStartToday = new Date();
  dateStartToday.setHours(0, 0, 0, 0);

  const dateEndToday = new Date();
  dateEndToday.setHours(23, 59, 59, 999);

  try {
    let appointments = await prisma.appointments.findMany({
      where: {
        date_time: {
          gte: dateStartToday,
          lte: dateEndToday,
        },
      },
      select: {
        notes: true,
        reason: true,
        date_time: true,
        student: {
          include: {
            student: {
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

    appointments = appointments.map((appointment) => {
      const date = new Date(appointment.date_time);
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      appointment.date_time = formattedDate;

      return appointment;
    });

    return NextResponse.json(
      { message: "Appointment Date Retrieved", appointments: appointments },
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
