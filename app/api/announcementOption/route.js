import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";

export async function DELETE(request) {
  const url = new URL(request.url);
  const resource_id = parseInt(url.searchParams.get("id"));

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    // Fetch the announcement to get the image path
    const announcement = await prisma.resources.findUnique({
      where: {
        resource_id: resource_id,
      },
    });

    // If there's an image associated with the announcement, delete it from Vercel Blob storage
    if (announcement.img_path) {
      await del(announcement.img_path);
    }

    // Delete the announcement from the database
    await prisma.resources.delete({
      where: {
        resource_id: resource_id,
      },
    });

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const formData = await request.formData();
  const resource_id = parseInt(formData.get("resource_id"));
  const title = formData.get("title");
  const description = formData.get("description");
  const link = formData.get("link");
  const image = formData.get("image");

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    // Fetch the current announcement to get the old image path
    const currentAnnouncement = await prisma.resources.findUnique({
      where: {
        resource_id: resource_id,
      },
    });

    let img_path = currentAnnouncement.img_path;

    // If there's a new image, upload it and update the img_path
    if (image) {
      // Upload the new image
      const { url } = await put(image.name, image, { access: "public" });
      img_path = url;

      // If there's an old image, delete it
      if (currentAnnouncement.img_path) {
        await del(currentAnnouncement.img_path);
      }
    }

    const updatedAnnouncement = await prisma.resources.update({
      where: {
        resource_id: resource_id,
      },
      data: {
        title: title,
        description: description,
        img_path: img_path,
        link: link,
      },
    });

    return NextResponse.json(
      {
        message: "Announcement updated successfully",
        announcement: updatedAnnouncement,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
