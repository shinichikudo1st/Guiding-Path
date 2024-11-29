import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

/**
 * @function GET Retrieves all appointments referred to by teacher from the database
 * @returns {NextResponse}
 */
export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const pageSize = 5;
  const { sessionData } = await getSession();

  if (!sessionData || sessionData.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);
  const skip = (pageNumber - 1) * limit;

  try {
    let totalAppointments;
    let appointments;

    totalAppointments = await prisma.appointments.count({
      where: {
        referral: {
          teacher_id: sessionData.id,
        },
        status: "pending",
      },
    });
    appointments = await prisma.appointments.findMany({
      skip,
      take: limit,
      where: {
        referral: {
          teacher_id: sessionData.id,
        },
        status: "pending",
      },
      include: {
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
        counselor: {
          select: {
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
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { message: "Error fetching referrals" },
      { status: 500 }
    );
  }
}
