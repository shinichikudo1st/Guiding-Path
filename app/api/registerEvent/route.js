import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";
import { getSession } from "@/app/utils/authentication";

export async function POST(request) {
  const { event_id } = await request.json();
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const event = await prisma.events.findUnique({
      where: { event_id: event_id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event_Registration.create({
      data: {
        event_id: event_id,
        student_id: sessionData.id,
        description: event.description,
        date_time: event.date_time,
        location: event.location,
      },
    });

    return NextResponse.json(
      { message: "Event registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering event:", error);
    return NextResponse.json(
      { error: "Failed to register event" },
      { status: 500 }
    );
  }
}
