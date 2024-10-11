import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, description, date_time, location, link } =
      await request.json();
    const { sessionData } = await getSession();

    if (!sessionData) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }

    if (!title || !description || !date_time || !location) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const formatDate = new Date(date_time);

    await Promise.all([
      prisma.events.create({
        data: {
          title,
          description,
          date_time: formatDate,
          location,
          link: link || null,
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "000",
          title: "New Event",
          content: `${sessionData.name} has created a new event: ${title}`,
          date: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ message: "New Event Created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
