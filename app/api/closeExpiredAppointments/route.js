import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

export async function GET() {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  try {
    const result = await prisma.appointments.updateMany({
      where: {
        status: "pending",
        date_time: {
          lte: oneMinuteAgo,
        },
      },
      data: {
        status: "closed",
      },
    });

    return NextResponse.json(
      {
        message: "Appointments updated successfully",
        updatedCount: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointments:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
