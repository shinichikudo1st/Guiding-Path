import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import moment from "moment-timezone";

export async function DELETE(request) {
  const url = new URL(request.url);
  const event_id = parseInt(url.searchParams.get("id"));

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    // Fetch the event to get the image path
    const event = await prisma.events.findUnique({
      where: {
        event_id: event_id,
      },
      select: {
        img_path: true,
      },
    });

    // If there's an image associated with the event, delete it from Vercel Blob storage
    if (event.img_path) {
      await del(event.img_path);
    }

    // Delete the event from the database
    await Promise.all([
      prisma.event_Registration.deleteMany({
        where: {
          event_id: event_id,
        },
      }),
      prisma.events.delete({
        where: {
          event_id: event_id,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const formData = await request.formData();
  const event_id = parseInt(formData.get("event_id"));
  const title = formData.get("title");
  const description = formData.get("description");
  const date_time = formData.get("date_time");
  const location = formData.get("location");
  const link = formData.get("link");
  const image = formData.get("image");
  const forDepartment = formData.get("forDepartment");

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    // Fetch the current event to get the old image path
    const currentEvent = await prisma.events.findUnique({
      where: {
        event_id: event_id,
      },
      select: {
        img_path: true,
      },
    });

    let img_path = currentEvent.img_path;

    // If there's a new image, upload it and update the img_path
    if (image) {
      const { url } = await put(image.name, image, { access: "public" });
      img_path = url;

      // If there's an old image, delete it
      if (currentEvent.img_path) {
        await del(currentEvent.img_path);
      }
    }

    const updatedEvent = await prisma.events.update({
      where: {
        event_id: event_id,
      },
      data: {
        title: title,
        description: description,
        date_time: moment.tz(date_time, "Asia/Manila").toDate(),
        location: location,
        link: link,
        img_path: img_path,
        forDepartment: forDepartment || null,
      },
    });

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
