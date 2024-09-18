import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const link = formData.get("link");
  const image = formData.get("image");

  let img_path = null;
  if (image) {
    const blob = await put(image.name, image, { access: "public" });
    img_path = blob.url;
  }

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const newAnnouncement = await prisma.resources.create({
      data: {
        title,
        description: content,
        link,
        img_path,
        category: "announcement",
      },
    });

    return NextResponse.json(
      {
        message: "Announcement created successfully",
        announcement: newAnnouncement,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
