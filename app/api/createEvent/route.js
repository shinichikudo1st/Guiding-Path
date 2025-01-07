import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import moment from "moment-timezone";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const date_time = formData.get("date_time");
    const location = formData.get("location");
    const link = formData.get("link");
    const image = formData.get("image");
    const forDepartment = formData.get("forDepartment");
    const limit = formData.get("limit") ? parseInt(formData.get("limit")) : null;
    const grade_level = formData.get("grade_level");
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

    const eventDate = moment.tz(date_time, "Asia/Manila").toDate();
    const today = moment().tz("Asia/Manila");
    today.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    if (eventDate < today) {
      return NextResponse.json(
        { message: "Event cannot be scheduled in the past" },
        { status: 400 }
      );
    }

    let img_path = null;
    if (image) {
      const blob = await put(image.name, image, { access: "public" });
      img_path = blob.url;
    }

    await Promise.all([
      prisma.events.create({
        data: {
          title,
          description,
          date_time: eventDate,
          location,
          link: link || null,
          img_path,
          forDepartment,
          limit,
          grade_level,
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "000",
          title: "New Event",
          content: `${sessionData.name} has created a new event: ${title}`,
          date: moment().tz("Asia/Manila").toDate(),
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
