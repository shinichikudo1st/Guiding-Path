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
    const resource = await prisma.resources.findUnique({
      where: {
        resource_id: resource_id,
      },
    });
    // If there's an image associated with the resource, delete it from Vercel Blob storage
    if (resource.img_path) {
      await del(resource.img_path);
    }

    // Delete the resource from the database
    await prisma.resources.delete({
      where: {
        resource_id: resource_id,
      },
    });

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting resource:", error);
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
    // Fetch the current resource to get the old image path
    const currentResource = await prisma.resources.findUnique({
      where: {
        resource_id: resource_id,
      },
    });

    let img_path = currentResource.img_path;

    // If there's a new image, upload it and update the img_path
    if (image) {
      // Upload the new image
      const { url } = await put(image.name, image, { access: "public" });
      img_path = url;

      // If there's an old image, delete it
      if (currentResource.img_path) {
        await del(currentResource.img_path);
      }
    }

    const updatedResource = await prisma.resources.update({
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
        message: "Resource updated successfully",
        resource: updatedResource,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
