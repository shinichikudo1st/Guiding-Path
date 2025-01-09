import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = parseInt(searchParams.get("eventId"));

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const count = await prisma.event_Registration.count({
      where: {
        event_id: eventId,
      },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error getting register count:", error);
    return NextResponse.json(
      { error: "Failed to get register count" },
      { status: 500 }
    );
  }
}
