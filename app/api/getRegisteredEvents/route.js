import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { sessionData } = await getSession();

    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    const registeredEvents = await prisma.event_Registration.findMany({
      where: {
        student_id: sessionData.id,
      },
      select: {
        event_id: true,
      },
    });

    const registeredEventIds = registeredEvents.map((event) => event.event_id);

    return NextResponse.json({ registeredEventIds }, { status: 200 });
  } catch (error) {
    console.error("Error fetching registered events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
