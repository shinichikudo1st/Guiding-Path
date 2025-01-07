import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { sessionData } = await getSession();

    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize;

    const [events, student, registrationCounts] = await Promise.all([
      prisma.events.findMany({
        skip,
        take: pageSize,
        orderBy: {
          date_time: "desc",
        },
      }),
      prisma.students.findUnique({
        where: {
          student_id: sessionData.id,
        },
        select: {
          department: true,
          grade_level: true,
        },
      }),
      prisma.events.findMany({
        select: {
          event_id: true,
          limit: true,
          _count: {
            select: {
              eventRegistrations: true,
            },
          },
        },
      }),
    ]);

    const eventsWithAccess = events.map((event) => {
      const registrationCount = registrationCounts.find(
        (count) => count.event_id === event.event_id
      )?._count.eventRegistrations || 0;

      return {
        ...event,
        userDepartment: student.department,
        userGradeLevel: student.grade_level,
        registrationCount,
        isFull: event.limit ? registrationCount >= event.limit : false,
        canRegister:
          (!event.forDepartment || event.forDepartment === student.department) &&
          (!event.grade_level || event.grade_level === student.grade_level) &&
          (!event.limit || registrationCount < event.limit),
      };
    });

    const totalEvents = await prisma.events.count();
    const totalPages = Math.ceil(totalEvents / pageSize);

    return NextResponse.json(
      { events: eventsWithAccess, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
