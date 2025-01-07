import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import moment from "moment-timezone";
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

  const dateStartToday = moment().startOf("day");
  const dateEndToday = moment().endOf("day");

  try {
    let totalAppointments;
    let appointments;

    if (type === "today") {
      totalAppointments = await prisma.appointments.count({
        where: {
          status: "pending",
          date_time: {
            gt: dateStartToday,
            lte: dateEndToday,
          },
        },
      });
      appointments = await prisma.appointments.findMany({
        where: {
          status: "pending",
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
          status: "pending",
          date_time: {
            gt: dateEndToday,
          },
        },
      });
      appointments = await prisma.appointments.findMany({
        skip,
        take: limit,
        where: {
          status: "pending",
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
      const date = moment(appointment.date_time).tz("Asia/Manila");
      const formattedDate = date.format("ddd, MMM D, YYYY h:mm A");

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
