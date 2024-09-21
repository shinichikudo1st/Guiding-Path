import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const pageSize = 10;
  const { sessionData } = await getSession();

  const pageNumber = parseInt(page);
  const limit = parseInt(pageSize);
  const skip = (pageNumber - 1) * limit;

  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const totalResources = await prisma.resources.count({
      where: {
        category: "resource",
      },
    });
    let resources = await prisma.resources.findMany({
      where: {
        category: "resource",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        resource_id: true,
        title: true,
        description: true,
        createdAt: true,
        img_path: true,
        link: true,
      },
    });

    return NextResponse.json(
      {
        resources,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalResources / limit),
        totalResources,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
