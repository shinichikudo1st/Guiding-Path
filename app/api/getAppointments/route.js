import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const page = url.searchParams.get("page");
  const pageSize = 5;
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);
  const skip = (pageNumber - 1) * limit;

  const dateStartToday = new Date();
  dateStartToday.setHours(0, 0, 0, 0);

  const dateEndToday = new Date();
  dateEndToday.setHours(23, 59, 59, 999);

  try {
    let totalAppointments;
    let appointments;

    if (type === "today") {
      totalAppointments = await prisma.appointments.count({
        where: {
          date_time: {
            gt: dateStartToday,
            lte: dateEndToday,
          },
        },
      });
      appointments = await prisma.appointments.findMany({
        where: {
          date_time: {
            gt: dateStartToday,
            lte: dateEndToday,
          },
        },
        select: {
          appointment_id: true,
          notes: true,
          reason: true,
          date_time: true,
          counsel_type: true,
          student: {
            select: {
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
    } else if (type === "upcoming") {
      totalAppointments = await prisma.appointments.count({
        where: {
          date_time: {
            gt: dateEndToday,
          },
        },
      });
      appointments = await prisma.appointments.findMany({
        skip,
        take: limit,
        where: {
          date_time: {
            gt: dateEndToday,
          },
        },
        select: {
          appointment_id: true,
          notes: true,
          reason: true,
          date_time: true,
          counsel_type: true,
          student: {
            select: {
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
        orderBy: {
          date_time: "asc",
        },
      });
    }

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
      {
        message: "Appointment Data Retrieved",
        appointments: appointments,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAppointments / limit),
        totalAppointments,
      },
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
