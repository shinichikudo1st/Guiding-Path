import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        OR: [{ user_id: sessionData.id }, { user_id: "000" }],
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    const totalCount = await prisma.notifications.count({
      where: {
        OR: [{ user_id: sessionData.id }, { user_id: "000" }],
      },
    });

    return NextResponse.json(
      {
        notifications,
        hasMore: skip + notifications.length < totalCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const { notificationId } = await request.json();

  try {
    const notification = await prisma.notifications.update({
      where: {
        notification_id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { sessionData } = await getSession();
  if (!sessionData) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  const { notificationId } = await request.json();

  try {
    await prisma.notifications.delete({
      where: {
        notification_id: notificationId,
      },
    });

    return NextResponse.json(
      { message: "Notification deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
