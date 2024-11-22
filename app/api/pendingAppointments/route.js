import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    let appointments = await prisma.appointments.findMany({
      where: {
        status: "pending",
        student_id: sessionData.id,
      },
      include: {
        counselor: {
          include: {
            counselor: {
              select: {
                profilePicture: true,
                name: true,
                contact: true,
              },
            },
          },
        },
      },
      orderBy: {
        date_time: "asc",
      },
    });

    appointments = appointments.map((appointment) => {
      const date = new Date(appointment.date_time);
      const formattedDate = date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      return {
        ...appointment,
        raw_date: date.getTime(),
        date_time: formattedDate,
      };
    });

    appointments.sort((a, b) => {
      const today = new Date().getTime();
      return Math.abs(a.raw_date - today) - Math.abs(b.raw_date - today);
    });

    return NextResponse.json(
      { message: "Retrieved Appointments", appointment: appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
