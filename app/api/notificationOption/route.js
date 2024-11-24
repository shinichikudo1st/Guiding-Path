import { getSession } from "@/app/utils/authentication";
import prisma from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { sessionData } = await getSession();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const roleConditions = [{ user_id: sessionData.id }];

  if (sessionData.role === "student") {
    roleConditions.push({ user_id: "000" });
  }

  if (sessionData.role === "student" || sessionData.role === "teacher") {
    roleConditions.push({ user_id: "001" });
  }

  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        OR: roleConditions,
        NOT: {
          notificationStatus: {
            some: {
              user_id: sessionData.id,
              isDeleted: true,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        notificationStatus: {
          where: {
            user_id: sessionData.id,
          },
        },
      },
    });

    const totalCount = await prisma.notifications.count({
      where: {
        OR: roleConditions,
      },
    });

    const mappedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: notification.notificationStatus.some((status) => status.isRead),
      notificationStatus: undefined,
    }));

    return NextResponse.json(
      {
        notifications: mappedNotifications,
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
  const { notificationId } = await request.json();

  try {
    await prisma.notificationStatus.upsert({
      where: {
        notification_id_user_id: {
          notification_id: notificationId,
          user_id: sessionData.id,
        },
      },
      update: {
        isRead: true,
        readAt: new Date(),
      },
      create: {
        notification_id: notificationId,
        user_id: sessionData.id,
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating notification status:", error);
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
    const notification = await prisma.notifications.findUnique({
      where: {
        notification_id: notificationId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    // If it's a personal notification
    if (notification.user_id === sessionData.id) {
      // Delete notification status records first due to foreign key constraints
      await prisma.notificationStatus.deleteMany({
        where: {
          notification_id: notificationId,
        },
      });

      // Then delete the notification itself
      await prisma.notifications.delete({
        where: {
          notification_id: notificationId,
        },
      });
    }
    // If it's a broadcast notification (000 or 001)
    else if (notification.user_id === "000" || notification.user_id === "001") {
      await prisma.notificationStatus.upsert({
        where: {
          notification_id_user_id: {
            notification_id: notificationId,
            user_id: sessionData.id,
          },
        },
        update: {
          isDeleted: true,
          deletedAt: new Date(),
        },
        create: {
          notification_id: notificationId,
          user_id: sessionData.id,
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    } else {
      return NextResponse.json(
        { message: "Not authorized to delete this notification" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Notification deleted successfully" },
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
