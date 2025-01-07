import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 200 });
  }

  const today = moment().tz("Asia/Manila");
  today.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  try {
    const appointment = await prisma.appointments.findMany({
      where: {
        student_id: sessionData.id,
        date_time: {
          gte: today,
          lt: today.clone().add(1, "day"),
        },
      },
      include: {
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

    return NextResponse.json({ appointment: appointment }, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
