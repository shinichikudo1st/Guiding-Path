import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");

  if (!sessionData || !sessionData.id) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { message: "Invalid month format" },
      { status: 400 }
    );
  }

  try {
    const [year, monthNum] = month.split("-");
    const startDate = new Date(`${year}-${monthNum}-01T00:00:00Z`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const allAppointments = await prisma.appointments.findMany({
      where: {
        date_time: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        appointment_id: true,
        date_time: true,
        student_id: true,
      },
    });

    return NextResponse.json(
      { appointments: allAppointments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
