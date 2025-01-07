import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import moment from "moment-timezone";

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
    const [newAnnouncement] = await Promise.all([
      prisma.resources.create({
        data: {
          title,
          description: content,
          link,
          img_path,
          category: "resource",
        },
      }),
      prisma.notifications.create({
        data: {
          user_id: "001",
          title: "New Resource Posted",
          content: `${title} has been added to the resources`,
          date: moment().tz("Asia/Manila").toDate(),
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Resource created successfully",
        resource: newAnnouncement,
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
