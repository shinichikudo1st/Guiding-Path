import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { sessionData } = await getSession();
    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = parseInt(searchParams.get("eventId"));

    if (!eventId) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }

    const count = await prisma.event_Registration.count({
      where: {
        event_id: eventId
      }
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
