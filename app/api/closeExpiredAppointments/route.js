import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import { getSession } from "@/app/utils/authentication";

export async function PUT() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  try {
    await prisma.appointments.updateMany({
      where: {
        status: "pending",
        date_time: {
          lte: oneHourAgo,
        },
      },
      data: {
        status: "closed",
      },
    });

    return NextResponse.json(
      {
        message: "Appointments updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
