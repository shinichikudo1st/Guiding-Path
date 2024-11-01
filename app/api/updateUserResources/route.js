import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const resourceId = parseInt(searchParams.get("resourceId"));

  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    // First, check if the user_resource entry exists
    const existingResource = await prisma.user_Resources.findUnique({
      where: {
        user_id_resource_id: {
          user_id: sessionData.id,
          resource_id: resourceId,
        },
      },
    });

    if (existingResource) {
      // If it exists, toggle the liked status
      await prisma.user_Resources.update({
        where: {
          user_id_resource_id: {
            user_id: sessionData.id,
            resource_id: resourceId,
          },
        },
        data: {
          liked: !existingResource.liked,
        },
      });
    } else {
      // If it doesn't exist, create a new entry with liked set to true
      await prisma.user_Resources.create({
        data: {
          resource_id: resourceId,
          user_id: sessionData.id,
          liked: true,
          access_date: new Date(),
        },
      });
    }

    return NextResponse.json(
      { message: "Resource updated successfully" },
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

export async function GET() {
  const { sessionData } = await getSession();

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const likedResources = await prisma.user_Resources.findMany({
      where: {
        user_id: sessionData.id,
        liked: true,
      },
    });

    return NextResponse.json({ likedResources });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
