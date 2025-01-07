import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

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
      // Convert to moment object in Manila timezone
      const date = moment(appointment.date_time).tz("Asia/Manila");
      const formattedDate = date.format("ddd, MMM D, YYYY h:mm A");

      return {
        ...appointment,
        raw_date: date.valueOf(), // equivalent to getTime()
        date_time: formattedDate,
      };
    });

    appointments.sort((a, b) => {
      const today = moment().tz("Asia/Manila").valueOf();
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
